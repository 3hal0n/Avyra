package backend.controller;

import java.util.List;
import java.util.Map;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import backend.service.ChatbotService;

public class ChatbotControllerDataProviderTest {

    @Mock
    private ChatbotService chatbotService;

    @InjectMocks
    private ChatbotController chatbotController;

    private AutoCloseable closeable;

    @BeforeMethod
    public void setUp() {
        closeable = MockitoAnnotations.openMocks(this);
    }

    @AfterMethod
    public void tearDown() throws Exception {
        closeable.close();
    }

    @DataProvider(name = "chatPrompts")
    public Object[][] chatPrompts() {
        return new Object[][]{
                {"Recommend an RPG", "Try Cyberpunk 2077."},
                {"Suggest a sports game", "NBA 2K25 is a good pick."},
                {"Need a PS5 adventure", "Try God of War: Ragnarok."}
        };
    }

    @Test(dataProvider = "chatPrompts")
    public void chat_shouldReturnStubbedResponse_forMultipleInputs(String prompt, String stubbedReply) throws Exception {
        when(chatbotService.generateResponse(prompt)).thenReturn(stubbedReply);

        ResponseEntity<Map<String, Object>> response = chatbotController.chat(Map.of("message", prompt));

        Assert.assertEquals(response.getStatusCode(), HttpStatus.OK);
        Assert.assertEquals(response.getBody().get("success"), true);
        Assert.assertEquals(response.getBody().get("response"), stubbedReply);
        verify(chatbotService).generateResponse(prompt);
    }

    @Test
    public void chat_shouldReturnBadRequest_whenServiceThrowsException() throws Exception {
        String prompt = "cause failure";
        when(chatbotService.generateResponse(prompt)).thenThrow(new RuntimeException("LLM unavailable"));

        ResponseEntity<Map<String, Object>> response = chatbotController.chat(Map.of("message", prompt));

        Assert.assertEquals(response.getStatusCode(), HttpStatus.BAD_REQUEST);
        Assert.assertEquals(response.getBody().get("success"), false);
        Assert.assertEquals(response.getBody().get("error"), "LLM unavailable");
        verify(chatbotService).generateResponse(prompt);
    }

    @Test
    public void getGames_shouldReturnGameList_whenServiceSucceeds() {
        List<Map<String, Object>> games = List.of(
                Map.of("id", 1, "name", "Spider-Man"),
                Map.of("id", 2, "name", "Cyberpunk 2077")
        );
        when(chatbotService.getGameData()).thenReturn(games);

        ResponseEntity<Map<String, Object>> response = chatbotController.getGames();

        Assert.assertEquals(response.getStatusCode(), HttpStatus.OK);
        Assert.assertEquals(response.getBody().get("success"), true);
        Assert.assertEquals(response.getBody().get("games"), games);
        verify(chatbotService).getGameData();
    }
}