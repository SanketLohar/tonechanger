package com.backend.demo.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String name;              // 👈 this is missing
    private String email;
    private String password;
    private String confirmPassword;
}
