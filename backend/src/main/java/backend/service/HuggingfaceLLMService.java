package backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class HuggingfaceLLMService {

    @Value("${huggingface.api.key}")
    private String apiKey;

    @Value("${huggingface.model.llm}")
    private String model;

    private final RestTemplate restTemplate = new RestTemplate();

    public String generateAnswer(String prompt) {
        String modelUrl = "https://api-inference.huggingface.co/models/" + model;

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        String body = "{ \"inputs\": \"" + prompt.replace("\"", "\\\"") + "\" }";

        HttpEntity<String> entity = new HttpEntity<>(body, headers);
        ResponseEntity<String> response = restTemplate.exchange(
                modelUrl, HttpMethod.POST, entity, String.class
        );

        try {
            JsonNode arr = new com.fasterxml.jackson.databind.ObjectMapper().readTree(response.getBody());
            return arr.isArray() ? arr.get(0).get("generated_text").asText() : response.getBody();
        } catch (Exception e) {
            return "Error parsing AI response";
        }
    }
}
