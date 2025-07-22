package backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @EmbeddedId
    private OrderItemId id = new OrderItemId();

    @ManyToOne
    @MapsId("orderId")
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne
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

    // Getters and setters
    // (Use Lombok @Data if you prefer)
}
