package backend.service.impl;

import backend.service.ChatbotService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.DefaultUriBuilderFactory;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class ChatbotServiceImpl implements ChatbotService {

    private final String apiKey;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ChatbotServiceImpl(@Value("${HUGGINGFACE_API_KEY}") String apiKey) {
        this.apiKey = apiKey;
        this.restTemplate = new RestTemplate();
        this.restTemplate.setUriTemplateHandler(new DefaultUriBuilderFactory("https://api-inference.huggingface.co"));
    }

    private String queryAI(String prompt, String model) {
        String url = "/models/" + model;
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        String body = "{ \"inputs\": \"" + prompt.replace("\"", "\\\"") + "\" }";
        HttpEntity<String> entity = new HttpEntity<>(body, headers);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
        try {
            JsonNode arr = objectMapper.readTree(response.getBody());
            if (arr.isArray() && arr.size() > 0) {
                return arr.get(0).get("generated_text").asText();
            }
            return response.getBody(); // fallback raw
        } catch (Exception e) {
            return "Sorry, could not process your request.";
        }
    }

    @Override
    public String getRecommendation(String prompt) {
        String systemPrompt = "You are a gaming expert. Recommend games based on this user query: " + prompt;
        return queryAI(systemPrompt, "meta-llama/Llama-3.3-70B-Instruct");
        // You can use another suitable conversational model from HuggingFace Hub
    }

    @Override
    public String getSystemRequirements(String prompt) {
        String systemPrompt = "Given this PC setup, recommend the best games from modern AAA to indie and explain reasoning for each: " + prompt;
        return queryAI(systemPrompt, "meta-llama/Llama-3.3-70B-Instruct");
    }
}
