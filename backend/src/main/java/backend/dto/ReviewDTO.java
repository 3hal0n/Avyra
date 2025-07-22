package backend.dto;

import java.time.LocalDateTime;

public class ReviewDTO {
    private Long id;
    private String username;
    private int rating;
    private String comment;
    private LocalDateTime createdAt;

    public ReviewDTO(Long id, String username, int rating, String comment, LocalDateTime createdAt) {
        this.id = id;
        this.username = username;
        this.rating = rating;
        this.comment = comment;
        this.createdAt = createdAt;
    }

    // Getters

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public int getRating() {
        return rating;
    }

    public String getComment() {
        return comment;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
