package com.backend.demo.dto;

public class RewriteRequest {

    private String prompt;
    private String tone;

    // Default constructor
    public RewriteRequest() {
    }

    // All-args constructor
    public RewriteRequest(String prompt, String tone) {
        this.prompt = prompt;
        this.tone = tone;
    }

    // Getters and Setters
    public String getPrompt() {
        return prompt;
    }

    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }

    public String getTone() {
        return tone;
    }

    public void setTone(String tone) {
        this.tone = tone;
    }
}
