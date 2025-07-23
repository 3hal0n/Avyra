package backend.dto;

public class WishlistGameDTO {
    private Long gameId;
    private String title;

    public WishlistGameDTO(Long gameId, String title) {
        this.gameId = gameId;
        this.title = title;
    }

    public Long getGameId() { return gameId; }
    public String getTitle() { return title; }
}
