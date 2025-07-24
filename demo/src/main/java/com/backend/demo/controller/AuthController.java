package com.backend.demo.controller;

import com.backend.demo.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    // ✅ Register Endpoint
    @PostMapping("/register")
    public String register(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        return authService.register(email, password);
    }

    // ✅ Login Endpoint
    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        return authService.login(email, password);
    }
}
