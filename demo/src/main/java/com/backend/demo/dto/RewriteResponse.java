package com.backend.demo.dto;

// It's good practice to wrap responses in a DTO for consistency and future extensibility.
public class RewriteResponse {
    private String rewrittenText;

    public RewriteResponse(String rewrittenText) {
        this.rewrittenText = rewrittenText;
    }

    public String getRewrittenText() {
        return rewrittenText;
    }

    public void setRewrittenText(String rewrittenText) {
        this.rewrittenText = rewrittenText;
    }
}
