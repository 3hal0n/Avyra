package backend.repository;

import backend.model.GameTrailer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GameTrailerRepository extends JpaRepository<GameTrailer, Long> {
    List<GameTrailer> findByGameIdOrderBySortOrderAsc(Long gameId);
}
