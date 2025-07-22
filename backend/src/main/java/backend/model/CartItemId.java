package backend.model;

import java.io.Serializable;
import java.util.Objects;

public class CartItemId implements Serializable {

    private Long user;
    private Long game;

    public CartItemId() {}

    public CartItemId(Long user, Long game) {
        this.user = user;
        this.game = game;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof CartItemId)) return false;
        CartItemId that = (CartItemId) o;
        return Objects.equals(user, that.user) && Objects.equals(game, that.game);
    }

    @Override
    public int hashCode() {
        return Objects.hash(user, game);
    }
}
