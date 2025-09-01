package com.backend.demo.dto;

public class RewriteRequest {
    private String text;
    private String tone;

    public RewriteRequest() {}

    public RewriteRequest(String text, String tone) {
        this.text = text;
        this.tone = tone;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getTone() {
        return tone;
    }

    public void setTone(String tone) {
        this.tone = tone;
    }
}
