package backend.service;

import backend.model.GameTrailer;
import backend.repository.GameTrailerRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class GameTrailerService {
    private final GameTrailerRepository repo;

    public GameTrailerService(GameTrailerRepository repo) {
        this.repo = repo;
    }

    public List<GameTrailer> getTrailersForGame(Long gameId) {
        return repo.findByGameIdOrderBySortOrderAsc(gameId);
    }

    public GameTrailer addTrailer(GameTrailer trailer) {
        return repo.save(trailer);
    }

    public void deleteTrailer(Long id) {
        repo.deleteById(id);
    }
    // Optionally: update, getById, etc.
}
