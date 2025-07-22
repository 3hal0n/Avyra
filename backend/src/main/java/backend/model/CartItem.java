package backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "cart_items")
@IdClass(CartItemId.class)
public class CartItem {

    @Id
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Id
    @ManyToOne
    @JoinColumn(name = "game_id")
    private Game game;

    private int quantity;

    // Constructors
    public CartItem() {}

    public CartItem(User user, Game game, int quantity) {
        this.user = user;
        this.game = game;
        this.quantity = quantity;
    }

    // Getters and Setters
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Game getGame() { return game; }
    public void setGame(Game game) { this.game = game; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
}
