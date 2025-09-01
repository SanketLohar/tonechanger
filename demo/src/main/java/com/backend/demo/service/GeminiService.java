package com.backend.demo.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class GeminiService {

    @Value("${GEMINI_API_KEY}")
    private String geminiApiKey;

    private static final String GEMINI_API_URL =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=";

    public String getGeminiResponse(String prompt, String tone) {
        RestTemplate restTemplate = new RestTemplate();

        // Headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // SYSTEM instruction (strong prompt engineering)
        Map<String, Object> systemMessage = new HashMap<>();
        systemMessage.put("role", "system");
        systemMessage.put("parts", new Object[]{
                Map.of("text",
                        "You are an expert email rewriter. Rewrite the given text strictly in the requested tone: '"
                                + tone + "'.\n" +
                                "Rules:\n" +
                                "1. Do not change the meaning of the original text.\n" +
                                "2. Do not add extra explanations or comments.\n" +
                                "3. Only rewrite the content in the requested tone.\n" +
                                "4. If tone is unclear, default to 'professional'.")
        });

        // USER input (actual text to rewrite)
        Map<String, Object> userMessage = new HashMap<>();
        userMessage.put("role", "user");
        userMessage.put("parts", new Object[]{
                Map.of("text", prompt)
        });

        // Final request body
        Map<String, Object> finalBody = new HashMap<>();
        finalBody.put("contents", new Object[]{systemMessage, userMessage});

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(finalBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    GEMINI_API_URL + geminiApiKey,
                    HttpMethod.POST,
                    requestEntity,
                    String.class
            );

            return response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
            return "Error while calling Gemini API: " + e.getMessage();
        }
    }
}
