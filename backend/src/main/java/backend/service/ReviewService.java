package backend.service;

import backend.dto.ReviewDTO;
import backend.dto.ReviewRequestDTO;

import java.util.List;

public interface ReviewService {
    List<ReviewDTO> getReviewsForGame(Long gameId);
    void addReview(ReviewRequestDTO dto);
    void deleteReview(Long reviewId);
}
