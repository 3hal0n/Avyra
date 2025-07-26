package backend.controller;


//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/orders")
//public class OrderController {
//
//    @Autowired
//    private OrderService orderService;
//
//    @PostMapping("/checkout")
//    public ResponseEntity<CheckoutResponseDTO> checkout() {
//        return ResponseEntity.ok(orderService.checkout());
//    }
//
//    @GetMapping
//    public ResponseEntity<List<Order>> getUserOrders() {
//        return ResponseEntity.ok(orderService.getOrdersForAuthenticatedUser());
//    }
//
//    @GetMapping("/{id}")
//    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
//        return ResponseEntity.ok(orderService.getOrderByIdForAuthenticatedUser(id));
//    }
//}

import backend.dto.CheckoutResponseDTO;
import backend.model.Order;
import backend.service.OrderService;

import backend.model.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Base64;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Value("${paypal.client-id}")
    private String paypalClientId;

    @Value("${paypal.client-secret}")
    private String paypalClientSecret;

    @Autowired
    private OrderService orderService;
    @GetMapping
    public ResponseEntity<List<Order>> getUserOrders() {
        return ResponseEntity.ok(orderService.getOrdersForAuthenticatedUser());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderByIdForAuthenticatedUser(id));
    }

    //Complete PayPal Order Webhook
    @PostMapping("/paypal-complete")
    public ResponseEntity<?> completePaypalOrder(
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User user) {
        String orderId = body.get("orderID");
        if (orderId == null) return ResponseEntity.badRequest().body(Map.of("error", "No orderID"));

        String accessToken = getPaypalAccessToken();
        if (accessToken == null) return ResponseEntity.status(500).body(Map.of("error", "PayPal auth failed"));

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));
        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<Map> resp = restTemplate.exchange(
                "https://api.sandbox.paypal.com/v2/checkout/orders/" + orderId,
                HttpMethod.GET, entity, Map.class);

        Map orderData = resp.getBody();
        if (orderData == null || !orderData.containsKey("status")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid PayPal response"));
        }
        String status = (String) orderData.get("status");
        if (!"COMPLETED".equals(status)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Not Completed: " + status));
        }

        // TODO: Validate price vs your DB, mark order as paid, grant game access etc.

        return ResponseEntity.ok(Map.of(
                "orderId", orderId,
                "message", "Order placed and payment successful!"
        ));
    }

    private String getPaypalAccessToken() {
        RestTemplate restTemplate = new RestTemplate();
        String creds = Base64.getEncoder().encodeToString((paypalClientId + ":" + paypalClientSecret).getBytes());
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Basic " + creds);
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<String> req = new HttpEntity<>("grant_type=client_credentials", headers);
        ResponseEntity<Map> resp = restTemplate.exchange(
                "https://api.sandbox.paypal.com/v1/oauth2/token",
                HttpMethod.POST, req, Map.class);
        Map map = resp.getBody();
        if (map != null && map.containsKey("access_token")) {
            return (String) map.get("access_token");
        }
        return null;
    }
}
