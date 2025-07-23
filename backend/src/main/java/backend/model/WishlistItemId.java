package backend.model;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class WishlistItemId implements Serializable {

    private Long userId;
    private Long gameId;

    public WishlistItemId() {}

    public WishlistItemId(Long userId, Long gameId) {
        this.userId = userId;
        this.gameId = gameId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof WishlistItemId)) return false;
        WishlistItemId that = (WishlistItemId) o;
        return Objects.equals(userId, that.userId) && Objects.equals(gameId, that.gameId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, gameId);
    }
}
