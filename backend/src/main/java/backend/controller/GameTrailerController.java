package backend.controller;



import backend.model.GameTrailer;
import backend.service.GameTrailerService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/game_trailers")
public class GameTrailerController {
    private final GameTrailerService service;

    public GameTrailerController(GameTrailerService service) {
        this.service = service;
    }

    @GetMapping
    public List<GameTrailer> listTrailers(@RequestParam Long gameId) {
        return service.getTrailersForGame(gameId);
    }

    @PostMapping
    public GameTrailer addTrailer(@RequestBody GameTrailer trailer) {
        return service.addTrailer(trailer);
    }

    @DeleteMapping("/{id}")
    public void deleteTrailer(@PathVariable Long id) {
        service.deleteTrailer(id);
    }
    // Optionally: put/patch for editing
}

