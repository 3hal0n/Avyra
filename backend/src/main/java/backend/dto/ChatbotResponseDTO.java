package backend.dto;

// backend.dto.ChatbotResponseDTO.java
public class ChatbotResponseDTO {
    private String result;   // AI reply or result
    public ChatbotResponseDTO(String result) { this.result = result; }
    // Getter

    public String getResult() {
        return result;
    }
}