package com.backend.demo;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class OpenAIService {

    @Value("${openai.api.key}")
    private String openaiApiKey;

    private final WebClient webClient = WebClient.builder()
            .baseUrl("https://api.openai.com/v1")
            .defaultHeader("Authorization", "Bearer " + openaiApiKey)
            .defaultHeader("Content-Type", "application/json")
            .build();

    public String rewriteEmail(String text, String tone) {
        String prompt = "Rewrite the following email in a " + tone + " tone:\n\n" + text;

        String body = String.format("{"model":"gpt-3.5-turbo","messages":[{"role":"user","content":"%s"}]}", prompt);

        return webClient.post()
                .uri("/chat/completions")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .onErrorReturn("⚠️ Error connecting to OpenAI.")
                .block();
    }
}
