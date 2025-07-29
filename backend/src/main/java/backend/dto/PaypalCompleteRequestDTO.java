package backend.dto;

import java.util.List;
import java.util.Map;

public class PaypalCompleteRequestDTO {
    private String orderID;
    private Map<String, Object> details; // Or define a PayPalDetailsDTO if you want
    private List<CartItemDTO> cartItems;
    private double totalAmount;

    // Getters and setters
    public String getOrderID() {
        return orderID;
    }

    public void setOrderID(String orderID) {
        this.orderID = orderID;
    }

    public Map<String, Object> getDetails() {
        return details;
    }

    public void setDetails(Map<String, Object> details) {
        this.details = details;
    }

    public List<CartItemDTO> getCartItems() {
        return cartItems;
    }

    public void setCartItems(List<CartItemDTO> cartItems) {
        this.cartItems = cartItems;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }
}
