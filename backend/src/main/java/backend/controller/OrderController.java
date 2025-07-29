package backend.controller;

import backend.dto.CheckoutResponseDTO;
import backend.dto.PayPalOrderDTO;
import backend.model.Order;
import backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<CheckoutResponseDTO> checkout() {
        CheckoutResponseDTO response = orderService.checkout();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/paypal-complete")
    public ResponseEntity<Order> completePaypalOrder(@RequestBody PayPalOrderDTO paypalOrderDTO) {
        Order order = orderService.completePaypalOrder(paypalOrderDTO.getOrderId());
        return ResponseEntity.ok(order);
    }

    @GetMapping
    public ResponseEntity<List<Order>> getUserOrders() {
        return ResponseEntity.ok(orderService.getOrdersForAuthenticatedUser());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderByIdForAuthenticatedUser(id));
    }
}
