package com.backend.demo.service;

public class RewriteSimulator {
    public static String simulate(String input, String tone) {
        switch (tone.toLowerCase()) {
            case "formal":
                return "Kindly provide the requested information at your earliest convenience.";
            case "polite":
                return "Could you please share the details when you get a moment?";
            case "assertive":
                return "Please send the requested information immediately.";
            case "apologetic":
                return "I apologize for the inconvenience, but I need the info as soon as possible.";
            case "friendly":
                return "Hey! Can you send me the info when you get a chance? 😊";
            default:
                return "Unable to rewrite in the given tone.";
        }
    }
}
