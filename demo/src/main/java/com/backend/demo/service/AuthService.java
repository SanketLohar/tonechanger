package com.backend.demo.service;

import com.backend.demo.model.User;
import com.backend.demo.repository.UserRepository;
import com.backend.demo.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // ✅ Register New User
    public String register(String email, String password) {
        if (userRepository.findByEmail(email).isPresent()) {
            return "⚠️ User already exists.";
        }

        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRoles(Collections.singletonList("USER"));

        userRepository.save(user);
        return "✅ User registered successfully.";
    }

    // ✅ Login User & Return Tokens
    public Map<String, String> login(String email, String rawPassword) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            throw new RuntimeException("⚠️ Invalid credentials.");
        }

        User user = optionalUser.get();
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new RuntimeException("⚠️ Invalid credentials.");
        }

        String accessToken = jwtUtil.generateToken(user.getEmail(), user.getRoles(), false);
        String refreshToken = jwtUtil.generateToken(user.getEmail(), user.getRoles(), true);

        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", accessToken);
        tokens.put("refreshToken", refreshToken);
        return tokens;
    }
}
