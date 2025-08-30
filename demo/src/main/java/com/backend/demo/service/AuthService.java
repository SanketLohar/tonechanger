package com.backend.demo.service;

import com.backend.demo.dto.LoginRequest;
import com.backend.demo.dto.RegisterRequest;
import com.backend.demo.model.User;
import com.backend.demo.repository.UserRepository;
// ✅ UPDATED: Import JwtService instead of JwtUtil
import com.backend.demo.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    // ✅ UPDATED: Inject JwtService, not the old JwtUtil
    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    public Map<String, Object> register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("ROLE_USER");
        User savedUser = userRepository.save(user);

        List<String> roles = savedUser.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        // ✅ UPDATED: Call the corrected generateToken method with two arguments
        String token = jwtService.generateToken(savedUser.getUsername(), roles);

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        // It's good practice to not return the savedUser object directly,
        // as it might contain sensitive info. A DTO is better, but this works for now.
        response.put("user", savedUser);
        return response;
    }

    public Map<String, Object> login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = (User) authentication.getPrincipal();

        List<String> roles = user.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        // ✅ UPDATED: Call the corrected generateToken method with two arguments
        String token = jwtService.generateToken(user.getUsername(), roles);

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", user);
        return response;
    }
}