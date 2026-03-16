package com.primaria.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.primaria.backend.model.User;
import com.primaria.backend.repository.UserRepository;
import com.primaria.backend.security.JwtUtil;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final JwtUtil jwUtil;

    public AuthService(UserRepository userRepository, PasswordEncoder encoder, JwtUtil jwUtil) {
        this.userRepository = userRepository;
        this.encoder = encoder;
        this.jwUtil = jwUtil;
    }

    public void register(String username, String password) {
        String hashed = encoder.encode(password);
        userRepository.save(new User(username, hashed));
    }

    public String login(String username, String password) {
        if (username == null || username.isBlank() || password == null) {
            return null;
        }

        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return null;
        }

        if (!encoder.matches(password, user.getPassword())) {
            return null;
        }

        return jwUtil.generateToken(username);
    }

    public boolean validateToken(String token) {
        try {
            String username = jwUtil.extractUsername(token);
            return (username != null && !jwUtil.isTokenExpired(token));
        } catch (Exception e) {
            return false;
        }
    }

    // Nuevo método
    public String extractUsernameFromToken(String token) {
        return jwUtil.extractUsername(token);
    }
}

