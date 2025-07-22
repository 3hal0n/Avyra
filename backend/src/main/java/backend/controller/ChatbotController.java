package backend.controller;

import backend.dto.ChatbotRequestDTO;
import backend.dto.ChatbotResponseDTO;
import backend.service.ChatbotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chatbot")
public class ChatbotController {

    @Autowired
    private ChatbotService chatbotService;

    @PostMapping("/recommend")
    public ResponseEntity<ChatbotResponseDTO> recommend(@RequestBody ChatbotRequestDTO dto) {
        String result = chatbotService.getRecommendation(dto.getPrompt());
        return ResponseEntity.ok(new ChatbotResponseDTO(result));
    }

    @PostMapping("/sysreq")
    public ResponseEntity<ChatbotResponseDTO> sysreq(@RequestBody ChatbotRequestDTO dto) {
        String result = chatbotService.getSystemRequirements(dto.getPrompt());
        return ResponseEntity.ok(new ChatbotResponseDTO(result));
    }
}
