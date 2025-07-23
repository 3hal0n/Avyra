package backend.service.impl;

import backend.dto.WishlistGameDTO;
import backend.model.Game;
import backend.model.User;
import backend.model.WishlistItem;
import backend.repository.GameRepository;
import backend.repository.WishlistRepository;
import backend.service.UserService;
import backend.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WishlistServiceImpl implements WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private UserService userService;

    @Override
    @Transactional
    public void addToWishlist(Long gameId) {
        User user = userService.getAuthenticatedUser();
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));

        if (wishlistRepository.existsByUserAndGameId(user, gameId)) {
            throw new RuntimeException("Game already in wishlist");
        }

        WishlistItem item = new WishlistItem(user, game);
        wishlistRepository.save(item);
    }

    @Override
    @Transactional
    public void removeFromWishlist(Long gameId) {
        User user = userService.getAuthenticatedUser();
        wishlistRepository.deleteByUserAndGameId(user, gameId);
    }

    @Override
    public List<WishlistGameDTO> getWishlist() {
        User user = userService.getAuthenticatedUser();
        List<WishlistItem> items = wishlistRepository.findByUser(user);
        return items.stream()
                .map(item -> new WishlistGameDTO(item.getGame().getId(), item.getGame().getTitle()))
                .collect(Collectors.toList());
    }
}
