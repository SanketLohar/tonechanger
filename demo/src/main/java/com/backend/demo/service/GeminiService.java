package com.backend.demo.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
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
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> systemMessage = new HashMap<>();
        systemMessage.put("role", "model");
        systemMessage.put("parts", new Object[]{
                Map.of("text",
                        "You are an expert email rewriter. Rewrite the given text strictly in the requested tone: '"
                                + tone + "'.\nRules:\n1. Do not change the meaning of the original text.\n2. Do not add extra explanations or comments.\n3. Only rewrite the content in the requested tone.\n4. If tone is unclear, default to 'professional'.")
        });

        Map<String, Object> userMessage = new HashMap<>();
        userMessage.put("role", "user");
        userMessage.put("parts", new Object[]{
                Map.of("text", prompt)
        });

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

            String responseBody = response.getBody();

            // Parse JSON response and extract the actual text
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(responseBody);
            JsonNode candidates = root.path("candidates");

            if (candidates.isArray() && candidates.size() > 0) {
                JsonNode firstCandidate = candidates.get(0);
                JsonNode content = firstCandidate.path("content");
                JsonNode parts = content.path("parts");
                if (parts.isArray() && parts.size() > 0) {
                    String text = parts.get(0).path("text").asText();

                    // ✅ Remove unwanted newline characters (\n, \r)
                    String cleanedText = text.replaceAll("\\r?\\n", " ").trim();

                    return cleanedText;
                }
            }

            return "No valid response from Gemini API.";

        } catch (Exception e) {
            e.printStackTrace();
            return "Error while calling Gemini API: " + e.getMessage();
        }
    }
}
