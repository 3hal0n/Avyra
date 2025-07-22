package backend.service;

import backend.dto.GameDTO;

import java.util.List;

public interface GameService {
    List<GameDTO> getAllGames();
    GameDTO getGameById(Long id);
}
