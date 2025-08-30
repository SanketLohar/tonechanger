package com.backend.demo.service; // Or com.backend.demo.security, your choice

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.List;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${JWT_SECRET}")
    private String secretKey;

    @Value("${jwt.expiration.ms}")
    private long expirationTime;

    /**
     * Creates a secure signing key from the secret string.
     */
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    /**
     * Generates a JWT with the user's email and their roles as claims.
     */
    public String generateToken(String email, List<String> roles) {
        return Jwts.builder()
                .setSubject(email)
                .claim("roles", roles) // Add roles to the token
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(getSigningKey(), SignatureAlgorithm.HS512) // HS512 is slightly more secure
                .compact();
    }

    /**
     * A generic function to extract any claim from a token.
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claimsResolver.apply(claims);
    }

    /**
     * Extracts the username (subject) from the token.
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extracts the expiration date from the token.
     */
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Checks if the token is expired.
     */
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Validates the token against the UserDetails object.
     */
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }
}