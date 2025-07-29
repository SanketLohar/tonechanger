package com.backend.demo.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class GeminiService {

    @Value("${GEMINI_API_KEY}")
    private String geminiApiKey;

    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=";

    public String getGeminiResponse(String prompt, String tone) {
        RestTemplate restTemplate = new RestTemplate();

        // Prepare headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Construct the request body as per Gemini API structure
        Map<String, Object> messagePart = new HashMap<>();
        messagePart.put("text", prompt + "\nTone: " + tone);

        Map<String, Object> content = new HashMap<>();
        content.put("parts", new Object[]{messagePart});
        content.put("role", "user");

        Map<String, Object> finalBody = new HashMap<>();
        finalBody.put("contents", new Object[]{content});

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(finalBody, headers);

        // Send request
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
