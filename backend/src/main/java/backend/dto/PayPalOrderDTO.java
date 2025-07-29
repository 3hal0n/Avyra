package backend.dto;

public class PayPalOrderDTO {
    private String orderId;

    public PayPalOrderDTO() {}

    public PayPalOrderDTO(String orderId) {
        this.orderId = orderId;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }
}
