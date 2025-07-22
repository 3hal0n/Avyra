package backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "games")
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Double price;

    private String genres;         // comma-separated genres

    private String platforms;      // comma-separated platforms

    private String coverUrl;

    @Column(name = "sysreq_min", columnDefinition = "TEXT")
    private String sysreqMin;

    @Column(name = "sysreq_rec", columnDefinition = "TEXT")
    private String sysreqRec;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Getters and setters omitted for brevity

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getSysreqRec() {
        return sysreqRec;
    }

    public void setSysreqRec(String sysreqRec) {
        this.sysreqRec = sysreqRec;
    }

    public String getSysreqMin() {
        return sysreqMin;
    }

    public void setSysreqMin(String sysreqMin) {
        this.sysreqMin = sysreqMin;
    }

    public String getCoverUrl() {
        return coverUrl;
    }

    public void setCoverUrl(String coverUrl) {
        this.coverUrl = coverUrl;
    }

    public String getPlatforms() {
        return platforms;
    }

    public void setPlatforms(String platforms) {
        this.platforms = platforms;
    }

    public String getGenres() {
        return genres;
    }

    public void setGenres(String genres) {
        this.genres = genres;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
