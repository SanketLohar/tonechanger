package com.backend.demo;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {
	public static void main(String[] args) {

		Dotenv dotenv = Dotenv.configure()
				.ignoreIfMissing() // Doesn't crash if .env is not there
				.load();


		dotenv.entries().forEach(entry -> {
			System.setProperty(entry.getKey(), entry.getValue());
		});


		SpringApplication.run(DemoApplication.class, args);
	}
}