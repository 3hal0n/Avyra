package backend.service.impl;

import backend.dto.ReviewDTO;
import backend.dto.ReviewRequestDTO;
import backend.model.Game;
import backend.model.Review;
import backend.model.User;
import backend.repository.GameRepository;
import backend.repository.ReviewRepository;
import backend.service.ReviewService;
import backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepo;

    @Autowired
    private GameRepository gameRepo;

    @Autowired
    private UserService userService;

    @Override
    public List<ReviewDTO> getReviewsForGame(Long gameId) {
        return reviewRepo.findByGameId(gameId).stream()
                .map(r -> new ReviewDTO(
                        r.getId(),
                        r.getUser().getUsername(),
                        r.getRating(),
                        r.getComment(),
                        r.getCreatedAt()
                )).collect(Collectors.toList());
    }

    @Override
    @Transactional // Added transaction annotation
    public void addReview(ReviewRequestDTO dto) {
        User user = userService.getAuthenticatedUser();
        Game game = gameRepo.findById(dto.getGameId())
                .orElseThrow(() -> new RuntimeException("Game not found"));

        // Check if user already reviewed this game
        boolean alreadyReviewed = reviewRepo.existsByUserIdAndGameId(user.getId(), game.getId());
        if (alreadyReviewed) {
            throw new RuntimeException("You already reviewed this game.");
        }

        Review review = new Review(
                game,
                user,
                dto.getRating(),
                dto.getComment(),
                LocalDateTime.now()
        );

        reviewRepo.save(review);
    }

    @Override
    @Transactional // Added transaction annotation
    public void deleteReview(Long reviewId) {
        User user = userService.getAuthenticatedUser();

        // First verify the review exists and belongs to the user
        Review review = reviewRepo.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (!review.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You can only delete your own reviews");
        }

        reviewRepo.deleteByIdAndUser(reviewId, user);
    }
}