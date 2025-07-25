package com.backend.demo.controller;

import com.backend.demo.service.OpenAIService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // ✅ Needed if frontend is on different port
public class RewriteController {

    private final OpenAIService openAIService;

    public RewriteController(OpenAIService openAIService) {
        this.openAIService = openAIService;
    }

    @PostMapping("/rewrite")
    public ResponseEntity<Map<String, String>> rewrite(@RequestBody Map<String, String> request) {
        String text = request.get("text");
        String tone = request.get("tone");

        System.out.println("📩 Text: " + text);
        System.out.println("🎯 Tone: " + tone);

        if (text == null || tone == null || text.isBlank() || tone.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid input"));
        }

        String rewritten = openAIService.rewriteEmail(text.trim(), tone.trim());

        return ResponseEntity.ok(Map.of("rewritten", rewritten));
    }
}
