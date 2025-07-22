package backend.dto;

import java.time.LocalDateTime;

public class CheckoutResponseDTO {
    private Long orderId;
    private String message;
    private LocalDateTime createdAt;

    public CheckoutResponseDTO(Long orderId, String message, LocalDateTime createdAt) {
        this.orderId = orderId;
        this.message = message;
        this.createdAt = createdAt;
    }

    public Long getOrderId() { return orderId; }
    public String getMessage() { return message; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
