package com.backend.demo;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class RewriteController {

    private final OpenAIService openAIService;

    public RewriteController(OpenAIService openAIService) {
        this.openAIService = openAIService;
    }

    @PostMapping("/rewrite")
    public ResponseEntity<Map<String, String>> rewrite(@RequestBody Map<String, String> request) {
        String text = request.get("text");
        String tone = request.get("tone");

        if (text == null || text.trim().isEmpty() || tone == null || tone.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid input"));
        }

        String rewritten = openAIService.rewriteEmail(text.trim(), tone.trim());
        Map<String, String> response = new HashMap<>();
        response.put("rewritten", rewritten);
        return ResponseEntity.ok(response);
    }
}
