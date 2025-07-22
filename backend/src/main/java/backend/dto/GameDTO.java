package backend.dto;

import java.time.LocalDateTime;

public class GameDTO {
    private Long id;
    private String title;
    private String description;
    private Double price;
    private String genres;
    private String platforms;
    private String coverUrl;
    private String sysreqMin;
    private String sysreqRec;
    private LocalDateTime createdAt;

    public GameDTO(Long id, String title, String description, Double price, String genres,
                   String platforms, String coverUrl, String sysreqMin, String sysreqRec, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.genres = genres;
        this.platforms = platforms;
        this.coverUrl = coverUrl;
        this.sysreqMin = sysreqMin;
        this.sysreqRec = sysreqRec;
        this.createdAt = createdAt;
    }

    //Add getters (optional: use Lombok @Getter or @Data)
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public Double getPrice() { return price; }
    public String getGenres() { return genres; }
    public String getPlatforms() { return platforms; }
    public String getCoverUrl() { return coverUrl; }
    public String getSysreqMin() { return sysreqMin; }
    public String getSysreqRec() { return sysreqRec; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
