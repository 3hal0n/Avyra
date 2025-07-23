package backend.service;

import backend.dto.WishlistGameDTO;

import java.util.List;

public interface WishlistService {
    void addToWishlist(Long gameId);
    void removeFromWishlist(Long gameId);
    List<WishlistGameDTO> getWishlist();
}
