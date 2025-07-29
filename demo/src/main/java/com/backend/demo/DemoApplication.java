package com.backend.demo;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {
	public static void main(String[] args) {
		// ✅ Load environment variables from .env file
		Dotenv dotenv = Dotenv.load();
		System.setProperty("GEMINI_API_KEY", dotenv.get("GEMINI_API_KEY"));

		SpringApplication.run(DemoApplication.class, args);
	}
}
