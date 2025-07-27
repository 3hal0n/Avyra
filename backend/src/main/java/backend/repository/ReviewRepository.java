package backend.repository;

import backend.model.Review;
import backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByGameId(Long gameId);

    boolean existsByUserIdAndGameId(Long userId, Long gameId);

    // Fixed: Added @Modifying and @Transactional annotations
    @Modifying
    @Transactional
    @Query("DELETE FROM Review r WHERE r.id = :reviewId AND r.user = :user")
    void deleteByIdAndUser(@Param("reviewId") Long reviewId, @Param("user") User user);
}