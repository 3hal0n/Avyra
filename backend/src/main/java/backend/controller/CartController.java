package backend.controller;

import backend.dto.CartItemDTO;
import backend.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    public ResponseEntity<List<CartItemDTO>> viewCart() {
        return ResponseEntity.ok(cartService.getUserCart());
    }

    @PostMapping("/{gameId}")
    public ResponseEntity<?> addToCart(
            @PathVariable Long gameId,
            @RequestParam(defaultValue = "1") int quantity) {
        cartService.addToCart(gameId, quantity);
        return ResponseEntity.ok("Game added to cart.");
    }

    @DeleteMapping("/{gameId}")
    public ResponseEntity<?> removeFromCart(@PathVariable Long gameId) {
        cartService.removeFromCart(gameId);
        return ResponseEntity.ok("Removed from cart.");
    }
}
