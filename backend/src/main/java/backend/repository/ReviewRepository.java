package backend.repository;

import backend.model.Review;
import backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByGameId(Long gameId);

    boolean existsByUserIdAndGameId(Long userId, Long gameId);

    void deleteByIdAndUser(Long id, User user);
}
