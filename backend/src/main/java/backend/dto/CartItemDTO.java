package backend.dto;

public class CartItemDTO {

    private Long gameId;
    private String title;
    private Double price;
    private int quantity;

    public CartItemDTO(Long gameId, String title, Double price, int quantity) {
        this.gameId = gameId;
        this.title = title;
        this.price = price;
        this.quantity = quantity;
    }

    // Getters
    public Long getGameId() { return gameId; }
    public String getTitle() { return title; }
    public Double getPrice() { return price; }
    public int getQuantity() { return quantity; }
}
