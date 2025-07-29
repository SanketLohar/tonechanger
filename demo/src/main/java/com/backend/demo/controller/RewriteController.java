package com.backend.demo.controller;

import com.backend.demo.dto.RewriteRequest;
import com.backend.demo.service.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rewrite")
@CrossOrigin(origins = "*")
public class RewriteController {

    @Autowired
    private GeminiService geminiService;

    @PostMapping
    public ResponseEntity<String> rewrite(@RequestBody RewriteRequest request) {
        String prompt = request.getPrompt();
        String tone = request.getTone();

        if (prompt == null || prompt.trim().isEmpty() || tone == null || tone.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Both prompt and tone are required.");
        }

        String result = geminiService.getGeminiResponse(prompt, tone);
        return ResponseEntity.ok(result);
    }
}
