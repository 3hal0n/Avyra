package backend.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;
import org.testng.asserts.SoftAssert;

import backend.dto.ReviewDTO;
import backend.dto.ReviewRequestDTO;
import backend.service.ReviewService;

public class ReviewControllerAssertionTest {

    @Mock
    private ReviewService reviewService;

    @InjectMocks
    private ReviewController reviewController;

    private AutoCloseable closeable;

    @BeforeMethod
    public void setUp() {
        closeable = MockitoAnnotations.openMocks(this);
    }

    @AfterMethod
    public void tearDown() throws Exception {
        closeable.close();
    }

    @Test
    public void postReview_shouldReturnSuccess_hardAssertions() {
        ReviewRequestDTO requestDTO = new ReviewRequestDTO();
        requestDTO.setGameId(1L);
        requestDTO.setRating(5);
        requestDTO.setComment("Great game");

        ResponseEntity<?> response = reviewController.postReview(requestDTO);

        Assert.assertEquals(response.getStatusCode(), HttpStatus.OK);
        Assert.assertEquals(response.getBody(), "Review added successfully");
        verify(reviewService).addReview(requestDTO);
    }

    @Test
    public void getReviews_shouldReturnExpectedReview_softAssertions() {
        ReviewDTO dto = new ReviewDTO(10L, "user1", 5, "Amazing", LocalDateTime.now());
        when(reviewService.getReviewsForGame(1L)).thenReturn(List.of(dto));

        ResponseEntity<List<ReviewDTO>> response = reviewController.getReviews(1L);

        SoftAssert softAssert = new SoftAssert();
        softAssert.assertEquals(response.getStatusCode(), HttpStatus.OK, "Status code mismatch");
        softAssert.assertNotNull(response.getBody(), "Response body should not be null");
        softAssert.assertEquals(response.getBody().size(), 1, "Review list size mismatch");
        softAssert.assertEquals(response.getBody().get(0).getComment(), "Amazing", "Review text mismatch");
        softAssert.assertAll();
    }

    @Test
    public void deleteReview_shouldReturnSuccess_hardAssertions() {
        ResponseEntity<?> response = reviewController.deleteReview(10L);

        Assert.assertEquals(response.getStatusCode(), HttpStatus.OK);
        Assert.assertEquals(response.getBody(), "Review deleted successfully");
        verify(reviewService).deleteReview(10L);
    }
}