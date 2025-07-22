package backend.controller;

import backend.dto.ReviewDTO;
import backend.dto.ReviewRequestDTO;
import backend.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping
    public ResponseEntity<List<ReviewDTO>> getReviews(@RequestParam("gameId") Long gameId) {
        return ResponseEntity.ok(reviewService.getReviewsForGame(gameId));
    }

    @PostMapping
    public ResponseEntity<?> postReview(@Valid @RequestBody ReviewRequestDTO reviewDto) {
        reviewService.addReview(reviewDto);
        return ResponseEntity.ok("Review added");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.ok("Review deleted");
    }
}
