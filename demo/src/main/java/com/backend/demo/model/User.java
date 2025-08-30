package com.backend.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

@Entity
@Data // Provides getters, setters, toString, equals, and hashCode
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "users") // Good practice to specify table name
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @JsonIgnore // Ensures password is not sent in API responses
    private String password;

    private String role;

    // --- UserDetails Interface Methods ---

    /**
     * ✅ CORRECTED: This now returns the user's role as a security authority.
     * This is crucial for @PreAuthorize and other role-based security to work.
     */
    @Override
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (this.role == null) {
            return Collections.emptyList();
        }
        // Spring Security needs a list of GrantedAuthority
        return List.of(new SimpleGrantedAuthority(this.role));
    }

    // Inside your User.java file

// ... other methods and fields

    @Override
    public String getUsername() {
        // ✅ ADD THIS NULL CHECK FOR DEBUGGING
        if (this.email == null || this.email.isEmpty()) {
            throw new IllegalArgumentException("User email cannot be null or empty.");
        }
        return this.email;
    }

    // ... other methods
    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    @JsonIgnore
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    @JsonIgnore
    public boolean isEnabled() {
        return true;
    }
}