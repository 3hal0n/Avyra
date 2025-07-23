package backend.repository;

import backend.model.User;
import backend.model.WishlistItem;
import backend.model.WishlistItemId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WishlistRepository extends JpaRepository<WishlistItem, WishlistItemId> {
    List<WishlistItem> findByUser(User user);
    void deleteByUserAndGameId(User user, Long gameId);
    boolean existsByUserAndGameId(User user, Long gameId);
}
