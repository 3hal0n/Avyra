package backend.repository;

import backend.model.CartItem;
import backend.model.CartItemId;
import backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, CartItemId> {
    List<CartItem> findByUser(User user);
    void deleteByUserAndGameId(User user, Long gameId);
}
