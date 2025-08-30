package com.backend.demo.controller;

import com.backend.demo.dto.LoginRequest;
import com.backend.demo.dto.RegisterRequest;
import com.backend.demo.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    // ✅ FIX: Changed return type from String to Map<String, Object> to match the service
    public ResponseEntity<Map<String, Object>> registerUser(@RequestBody RegisterRequest registerRequest) {
        Map<String, Object> response = authService.register(registerRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    // ✅ FIX: Changed return type from String to Map<String, Object> to match the service
    public ResponseEntity<Map<String, Object>> loginUser(@RequestBody LoginRequest loginRequest) {
        Map<String, Object> response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }
}