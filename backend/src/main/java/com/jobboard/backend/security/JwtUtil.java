package com.jobboard.backend.security;

import com.jobboard.backend.model.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private static final String SECRET = "8f5c2e8d3a91c90b8bd2f4763e2891a347abcee69d450bce3d1d3a12f9ae78a3"; // Must be 256-bit+ for HS256

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("role", user.getRole().name())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 24 hours
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String extractEmail(String token) {
        return extractClaims(token).getSubject();
    }

    public String extractRole(String token) {
        return (String) extractClaims(token).get("role");
    }

    public String validateTokenAndGetEmail(String token) {
        try {
            return extractClaims(token).getSubject();
        } catch (JwtException e) {
            return null; // Token invalid or expired
        }
    }
}
