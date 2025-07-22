package backend.service.impl;

import backend.dto.CartItemDTO;
import backend.model.CartItem;
import backend.model.Game;
import backend.model.User;
import backend.repository.CartItemRepository;
import backend.repository.GameRepository;
import backend.service.CartService;
import backend.service.UserService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private UserService userService;

    @Override
    public List<CartItemDTO> getUserCart() {
        User user = userService.getAuthenticatedUser();
        return cartItemRepository.findByUser(user).stream()
                .map(cartItem -> new CartItemDTO(
                        cartItem.getGame().getId(),
                        cartItem.getGame().getTitle(),
                        cartItem.getGame().getPrice(),
                        cartItem.getQuantity()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public void addToCart(Long gameId, int quantity) {
        User user = userService.getAuthenticatedUser();
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));

        CartItem existing = cartItemRepository.findById(new backend.model.CartItemId(user.getId(), game.getId()))
                .orElse(null);
        if (existing != null) {
            existing.setQuantity(existing.getQuantity() + quantity);
            cartItemRepository.save(existing);
        } else {
            cartItemRepository.save(new CartItem(user, game, quantity));
        }
    }

    @Override
    @Transactional
    public void removeFromCart(Long gameId) {
        User user = userService.getAuthenticatedUser();
        cartItemRepository.deleteByUserAndGameId(user, gameId);
    }
}
