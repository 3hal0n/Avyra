package backend.service.impl;

import backend.dto.GameDTO;
import backend.model.Game;
import backend.repository.GameRepository;
import backend.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GameServiceImpl implements GameService {

    private final GameRepository gameRepository;

    @Autowired
    public GameServiceImpl(GameRepository gameRepository) {
        this.gameRepository = gameRepository;
    }

    @Override
    public List<GameDTO> getAllGames() {
        List<Game> games = gameRepository.findAll();
        return games.stream()
                .map(this::toGameDTO)
                .collect(Collectors.toList());
    }

    @Override
    public GameDTO getGameById(Long id) {
        Game game = gameRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Game not found with id " + id));
        return toGameDTO(game);
    }

    @Override
    public List<GameDTO> getFilteredGames(String search, String genre, String platform, Double minPrice, Double maxPrice) {
        List<Game> games = gameRepository.findAll();
        return games.stream()
            .filter(game -> search == null || game.getTitle().toLowerCase().contains(search.toLowerCase()))
            .filter(game -> genre == null || game.getGenres().toLowerCase().contains(genre.toLowerCase()))
            .filter(game -> platform == null || game.getPlatforms().toLowerCase().contains(platform.toLowerCase()))
            .filter(game -> minPrice == null || game.getPrice() >= minPrice)
            .filter(game -> maxPrice == null || game.getPrice() <= maxPrice)
            .map(this::toGameDTO)
            .collect(Collectors.toList());
    }

    private GameDTO toGameDTO(Game game) {
        return new GameDTO(
                game.getId(),
                game.getTitle(),
                game.getDescription(),
                game.getPrice(),
                game.getGenres(),
                game.getPlatforms(),
                game.getCoverUrl(),
                game.getSysreqMin(),
                game.getSysreqRec(),
                game.getCreatedAt()
        );
    }
}
