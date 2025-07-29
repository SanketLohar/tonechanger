package com.backend.demo.repository;

import com.backend.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);         // Already needed for login
    boolean existsByEmail(String email);              // Add this for registration check
}
