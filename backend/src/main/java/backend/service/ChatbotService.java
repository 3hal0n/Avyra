package backend.service;

public interface ChatbotService {
    String getRecommendation(String prompt);
    String getSystemRequirements(String prompt);
}
