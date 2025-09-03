package com.backend.demo.controller;

import com.backend.demo.dto.RewriteRequest;
import com.backend.demo.dto.RewriteResponse;
import com.backend.demo.service.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/rewrite")
// The redundant @CrossOrigin annotation has been removed to rely on the global CORS configuration.
public class RewriteController {

    private final GeminiService geminiService;

    @Autowired
    public RewriteController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    // Rewrite from plain JSON request, producing a JSON response
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> rewrite(@RequestBody RewriteRequest request) {
        try {
            String text = request.getText();
            String tone = request.getTone();

            if (text == null || text.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Text is required.");
            }
            if (tone == null || tone.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Tone is required.");
            }

            String rewrittenText = geminiService.getGeminiResponse(text, tone);
            // Wrap the response in a DTO for a consistent JSON structure
            return ResponseEntity.ok(new RewriteResponse(rewrittenText));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body("Error while rewriting: " + e.getMessage());
        }
    }

    // Rewrite from uploaded file (multipart), producing a JSON response
    @PostMapping(
            path = "/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<?> rewriteFromFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("tone") String tone) {
        try {
            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is required.");
            }
            if (tone == null || tone.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Tone is required.");
            }

            String text = new String(file.getBytes(), StandardCharsets.UTF_8);

            if (text.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Uploaded file is empty.");
            }

            String rewrittenText = geminiService.getGeminiResponse(text, tone);
            // Also wrap this response in the DTO
            return ResponseEntity.ok(new RewriteResponse(rewrittenText));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body("Error while rewriting file: " + e.getMessage());
        }
    }
}

