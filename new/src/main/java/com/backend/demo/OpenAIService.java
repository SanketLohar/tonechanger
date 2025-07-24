package com.backend.demo;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class OpenAIService {

    @Value("${openai.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public String rewriteEmail(String text, String tone) {
        String prompt = "Rewrite the following email in a " + tone + " tone:\n\n" + text;

        String url = "https://api.openai.com/v1/chat/completions";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        String body = String.format("{"model": "gpt-3.5-turbo", "messages": [{"role": "user", "content": "%s"}]}", prompt);

        HttpEntity<String> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
            Map<String, Object> responseBody = response.getBody();
            if (responseBody != null) {
                var choices = (java.util.List<Map<String, Object>>) responseBody.get("choices");
                if (!choices.isEmpty()) {
                    var message = (Map<String, Object>) choices.get(0).get("message");
                    return message.get("content").toString();
                }
            }
        } catch (Exception e) {
            return "⚠️ Failed to connect to OpenAI.";
        }
        return "⚠️ No valid response from OpenAI.";
    }
}
