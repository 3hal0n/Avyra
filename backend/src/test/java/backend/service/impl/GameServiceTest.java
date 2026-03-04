package backend.service.impl;

import java.time.LocalDateTime;
import java.util.List;

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
}