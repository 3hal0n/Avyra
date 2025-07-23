package backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "wishlist")
public class WishlistItem {

    @EmbeddedId
    private WishlistItemId id = new WishlistItemId();

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @MapsId("gameId")
    @JoinColumn(name = "game_id")
    private Game game;

    public WishlistItem() {}

    public WishlistItem(User user, Game game) {
        this.user = user;
        this.game = game;
        this.id = new WishlistItemId(user.getId(), game.getId());
    }

    public User getUser() { return user; }
    public Game getGame() { return game; }
}
