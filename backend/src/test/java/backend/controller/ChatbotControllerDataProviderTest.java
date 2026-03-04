package backend.controller;

import backend.service.ChatbotService;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import java.util.Map;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

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
}