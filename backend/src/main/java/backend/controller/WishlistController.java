package backend.controller;

import backend.dto.WishlistGameDTO;
import backend.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    /**
     * View all games in the user's wishlist.
     */
    @GetMapping
    public ResponseEntity<List<WishlistGameDTO>> getWishlist() {
        List<WishlistGameDTO> wishlist = wishlistService.getWishlist();
        return ResponseEntity.ok(wishlist);
    }

    /**
     * Add a game to the authenticated user's wishlist.
     */
    @PostMapping("/{gameId}")
    public ResponseEntity<String> addToWishlist(@PathVariable Long gameId) {
        wishlistService.addToWishlist(gameId);
        return ResponseEntity.ok("Game added to wishlist.");
    }

    /**
     * Remove a game from the wishlist.
     */
    @DeleteMapping("/{gameId}")
    public ResponseEntity<String> removeFromWishlist(@PathVariable Long gameId) {
        wishlistService.removeFromWishlist(gameId);
        return ResponseEntity.ok("Game removed from wishlist.");
    }
}
