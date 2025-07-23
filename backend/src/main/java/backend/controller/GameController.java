package backend.controller;

import backend.dto.GameDTO;
import backend.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/games")
public class GameController {

    private final GameService gameService;

    @Autowired
    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    // GET /api/games — List all games, publicly accessible
    @GetMapping
    public ResponseEntity<List<GameDTO>> getAllGames(
        @RequestParam(required = false) String search,
        @RequestParam(required = false) String genre,
        @RequestParam(required = false) String platform,
        @RequestParam(required = false) Double minPrice,
        @RequestParam(required = false) Double maxPrice
    ) {
        List<GameDTO> games = gameService.getFilteredGames(search, genre, platform, minPrice, maxPrice);
        return ResponseEntity.ok(games);
    }

    // GET /api/games/{id} — Get game details by ID
    @GetMapping("/{id}")
    public ResponseEntity<GameDTO> getGameById(@PathVariable Long id) {
        GameDTO game = gameService.getGameById(id);
        return ResponseEntity.ok(game);
    }
}
