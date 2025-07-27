package backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ChatbotService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    // Game data from your provided list
    private final List<Map<String, Object>> games = Arrays.asList(
            Map.of(
                    "id", 1,
                    "name", "Spiderman",
                    "description", "Developed by Insomniac Games in collaboration with Marvel, and optimized for PC by Nixxes Software, Marvel's Spider-Man Remastered on PC introduces an experienced Peter Parker who's fighting big crime and iconic villains in Marvel's New York.",
                    "price", 59.99,
                    "genres", "Action, Adventure",
                    "platforms", "PC, PS5",
                    "image", "/img/spiderman.jpg",
                    "requirements", "Windows 10, i5, 8GB RAM, GTX 1060"
            ),
            Map.of(
                    "id", 2,
                    "name", "God of War: Ragnarok",
                    "description", "THE NORSE SAGA CONTINUES From Santa Monica Studio and brought to PC in partnership with Jetpack Interactive comes God of War Ragnarök, an epic and heartfelt journey that follows Kratos and Atreus as they struggle with holding on and letting go.",
                    "price", 69.99,
                    "genres", "Action, RPG",
                    "platforms", "PS5",
                    "image", "/img/gow_ragnarok.jpg",
                    "requirements", "PS5 only"
            ),
            Map.of(
                    "id", 3,
                    "name", "Spiderman: Miles Morales",
                    "description", "Following the events of Marvel's Spider-Man Remastered, teenager Miles Morales is adjusting to his new home while following in the footsteps of his mentor, Peter Parker, as a new Spider-Man.",
                    "price", 49.99,
                    "genres", "Action, Adventure",
                    "platforms", "PC, PS5",
                    "image", "/img/miles_morales.jpg",
                    "requirements", "Windows 10, i5, 8GB RAM, GTX 1070"
            ),
            Map.of(
                    "id", 4,
                    "name", "Stray",
                    "description", "Lost, alone and separated from family, a stray cat must untangle an ancient mystery to escape a long-forgotten city.",
                    "price", 29.99,
                    "genres", "Adventure, Indie",
                    "platforms", "PC, PS5",
                    "image", "/img/stray.jpg",
                    "requirements", "Windows 10, i5, 8GB RAM, GTX 1050"
            ),
            Map.of(
                    "id", 5,
                    "name", "NBA 2K25",
                    "description", "Command every court with authenticity and realism Powered by ProPLAY™, giving you ultimate control over how you play in NBA 2K25.",
                    "price", 59.99,
                    "genres", "Sports, Simulation",
                    "platforms", "PC, PS5, Xbox",
                    "image", "/img/nba2k25.jpg",
                    "requirements", "Windows 10, i7, 16GB RAM, RTX 2060"
            ),
            Map.of(
                    "id", 6,
                    "name", "Cyberpunk 2077",
                    "description", "Cyberpunk 2077 is an open-world, action-adventure RPG set in the megalopolis of Night City, where you play as a cyberpunk mercenary wrapped up in a do-or-die fight for survival.",
                    "price", 39.99,
                    "genres", "RPG, Action",
                    "platforms", "PC, PS5, Xbox",
                    "image", "/img/cyberpunk2077.jpg",
                    "requirements", "Windows 10, i7, 12GB RAM, GTX 1660"
            ),
            Map.of(
                    "id", 7,
                    "name", "Kingdom Come: Deliverance II",
                    "description", "A thrilling story-driven action RPG, with a rich open world, set in 15th century Medieval Europe.",
                    "price", 49.99,
                    "genres", "RPG, Action, Historical",
                    "platforms", "PC, PS5, Xbox",
                    "image", "/img/kingdom_come.jpg",
                    "requirements", "Windows 10, i7, 16GB RAM, GTX 1660 or better"
            ),
            Map.of(
                    "id", 8,
                    "name", "Dark Souls Remastered",
                    "description", "Then, there was fire. Re-experience the critically acclaimed, genre-defining game that started it all. Beautifully remastered, return to Lordran in stunning high-definition detail running at 60fps.",
                    "price", 39.99,
                    "genres", "Action, RPG, Souls-like",
                    "platforms", "PC, PS4, Xbox, Switch",
                    "image", "/img/dark_souls_remastered.jpg",
                    "requirements", "Windows 10, i5, 8GB RAM, GTX 660 or better"
            )
    );

    public String generateResponse(String userMessage) throws Exception {
        String systemPrompt = createSystemPrompt();
        String fullPrompt = systemPrompt + "\n\nUser: " + userMessage + "\n\nAssistant:";

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of(
                                "parts", List.of(
                                        Map.of("text", fullPrompt)
                                )
                        )
                ),
                "generationConfig", Map.of(
                        "temperature", 0.7,
                        "maxOutputTokens", 1000
                )
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-goog-api-key", geminiApiKey);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(
                geminiApiUrl, entity, String.class
        );

        return extractResponseText(response.getBody());
    }

    private String createSystemPrompt() {
        StringBuilder prompt = new StringBuilder();
        prompt.append("You are Avyra, an AI assistant for a game download platform. You help users find games, check system compatibility, and provide recommendations.\n\n");
        prompt.append("Available games in our catalog:\n");

        for (Map<String, Object> game : games) {
            prompt.append(String.format(
                    "- %s ($%.2f) - %s - Platforms: %s - Requirements: %s\n",
                    game.get("name"),
                    game.get("price"),
                    game.get("genres"),
                    game.get("platforms"),
                    game.get("requirements")
            ));
        }

        prompt.append("\nYou can help with:\n");
        prompt.append("1. Game recommendations based on preferences\n");
        prompt.append("2. System compatibility checks\n");
        prompt.append("3. Game information and pricing\n");
        prompt.append("4. Platform availability\n");
        prompt.append("5. Genre-based suggestions\n\n");
        prompt.append("Always be helpful, friendly, and provide accurate information about the games listed above.");

        return prompt.toString();
    }

    private String extractResponseText(String responseBody) throws Exception {
        JsonNode jsonNode = objectMapper.readTree(responseBody);
        return jsonNode.path("candidates")
                .path(0)
                .path("content")
                .path("parts")
                .path(0)
                .path("text")
                .asText();
    }

    public List<Map<String, Object>> getGameData() {
        return games;
    }

    public List<Map<String, Object>> getGamesByGenre(String genre) {
        return games.stream()
                .filter(game -> game.get("genres").toString().toLowerCase().contains(genre.toLowerCase()))
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getGamesByPlatform(String platform) {
        return games.stream()
                .filter(game -> game.get("platforms").toString().toLowerCase().contains(platform.toLowerCase()))
                .collect(Collectors.toList());
    }
}
