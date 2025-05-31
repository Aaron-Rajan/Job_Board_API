package com.jobboard.backend.controller;

import com.jobboard.backend.model.User;
import com.jobboard.backend.repository.UserRepository;
import com.jobboard.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already registered.");
        }

        user.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully.");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        System.out.println("LOGIN ATTEMPT:");
        System.out.println("Email: " + user.getEmail());
        System.out.println("Password: " + user.getPassword());
        Optional<User> found = userRepository.findByEmail(user.getEmail());
        if (found.isEmpty() || !new BCryptPasswordEncoder().matches(user.getPassword(), found.get().getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials.");
        }

        User dbUser = found.get();
        String token = jwtUtil.generateToken(dbUser);
        return ResponseEntity.ok(Map.of("token", token, "role", dbUser.getRole()));
    }
}
