package backend.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import backend.dto.GameDTO;
import backend.model.Game;
import backend.repository.GameRepository;

public class GameServiceTest {

    @Mock
    private GameRepository gameRepository;

    private GameServiceImpl gameService;
    private AutoCloseable closeable;

    @BeforeMethod
    public void setUp() {
        closeable = MockitoAnnotations.openMocks(this);
        gameService = new GameServiceImpl(gameRepository);
    }

    @AfterMethod
    public void tearDown() throws Exception {
        closeable.close();
        gameService = null;
    }

    @Test
    public void getAllGames_shouldReturnMappedDtos() {
        Game game = new Game();
        game.setId(1L);
        game.setTitle("Spider-Man");
        game.setDescription("Action adventure");
        game.setPrice(59.99);
        game.setGenres("Action");
        game.setPlatforms("PC,PS5");
        game.setCoverUrl("cover.jpg");
        game.setSysreqMin("8GB RAM");
        game.setSysreqRec("16GB RAM");
        game.setCreatedAt(LocalDateTime.now());

        when(gameRepository.findAll()).thenReturn(List.of(game));

        List<GameDTO> result = gameService.getAllGames();

        Assert.assertEquals(result.size(), 1);
        Assert.assertEquals(result.get(0).getId(), Long.valueOf(1L));
        Assert.assertEquals(result.get(0).getTitle(), "Spider-Man");
    }

    @Test
    public void getGameById_shouldReturnGame_whenIdExists() {
        Game game = new Game();
        game.setId(7L);
        game.setTitle("Cyberpunk 2077");
        game.setDescription("Open-world RPG");
        game.setPrice(39.99);
        game.setGenres("RPG,Action");
        game.setPlatforms("PC,PS5,Xbox");
        game.setCoverUrl("cyberpunk.jpg");
        game.setSysreqMin("8GB RAM");
        game.setSysreqRec("16GB RAM");
        game.setCreatedAt(LocalDateTime.now());

        when(gameRepository.findById(7L)).thenReturn(Optional.of(game));

        GameDTO result = gameService.getGameById(7L);

        Assert.assertEquals(result.getId(), Long.valueOf(7L));
        Assert.assertEquals(result.getTitle(), "Cyberpunk 2077");
        Assert.assertEquals(result.getPrice(), Double.valueOf(39.99));
    }

    @Test
    public void getFilteredGames_shouldFilterByGenreAndPrice() {
        Game actionGame = new Game();
        actionGame.setId(1L);
        actionGame.setTitle("Spider-Man");
        actionGame.setGenres("Action,Adventure");
        actionGame.setPlatforms("PC,PS5");
        actionGame.setPrice(59.99);
        actionGame.setCreatedAt(LocalDateTime.now());

        Game sportsGame = new Game();
        sportsGame.setId(2L);
        sportsGame.setTitle("NBA 2K25");
        sportsGame.setGenres("Sports,Simulation");
        sportsGame.setPlatforms("PC,PS5");
        sportsGame.setPrice(69.99);
        sportsGame.setCreatedAt(LocalDateTime.now());

        when(gameRepository.findAll()).thenReturn(List.of(actionGame, sportsGame));

        List<GameDTO> result = gameService.getFilteredGames(null, "Action", null, 40.0, 60.0);

        Assert.assertEquals(result.size(), 1);
        Assert.assertEquals(result.get(0).getTitle(), "Spider-Man");
    }
}