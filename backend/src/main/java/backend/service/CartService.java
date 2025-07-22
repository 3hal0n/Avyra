package backend.service;

import backend.dto.CartItemDTO;
import java.util.List;

public interface CartService {
    List<CartItemDTO> getUserCart();
    void addToCart(Long gameId, int quantity);
    void removeFromCart(Long gameId);
}
