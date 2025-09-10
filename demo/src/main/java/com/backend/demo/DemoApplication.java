package com.backend.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * This single annotation tells Spring Boot to scan the entire
 * "com.backend.demo" package and all its sub-packages for every type of
 * component (Controllers, Services, Entities, Repositories), fixing all
 * previous startup errors.
 */
@SpringBootApplication(scanBasePackages = "com.backend.demo")
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

}