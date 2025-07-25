package backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @EmbeddedId
    private OrderItemId id = new OrderItemId();

    @ManyToOne
    @MapsId("orderId")
    @JoinColumn(name = "order_id")
    @JsonBackReference          // Prevent back reference serialization (break cycle)
    private Order order;

    // Eager fetch to include game data in JSON response
    @ManyToOne(fetch = FetchType.EAGER)
    @MapsId("gameId")
    @JoinColumn(name = "game_id")
    private Game game;

    private int quantity;
    private double priceAtPurchase;

    public OrderItem() {}

    public OrderItem(Order order, Game game, int quantity, double priceAtPurchase) {
        this.order = order;
        this.game = game;
        this.quantity = quantity;
        this.priceAtPurchase = priceAtPurchase;
        this.id = new OrderItemId(order.getId(), game.getId());
    }

    public Order getOrder() { return order; }
    public Game getGame() { return game; }
    public int getQuantity() { return quantity; }
    public double getPriceAtPurchase() { return priceAtPurchase; }
    public OrderItemId getId() { return id; }

    public void setOrder(Order order) { this.order = order; }
    public void setGame(Game game) { this.game = game; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public void setPriceAtPurchase(double p) { this.priceAtPurchase = p; }
    public void setId(OrderItemId id) { this.id = id; }
}
