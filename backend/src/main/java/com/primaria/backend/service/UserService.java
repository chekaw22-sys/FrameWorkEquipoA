package com.primaria.backend.service;

import com.primaria.backend.model.User;
import com.primaria.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepo;
    private final PasswordEncoder encoder;

    public UserService(UserRepository userRepo, PasswordEncoder encoder) {
        this.userRepo = userRepo;
        this.encoder = encoder;
    }

    public User register(String username, String password) {
        User u = new User();
        u.setUsername(username);
        u.setPassword(encoder.encode(password));
        return userRepo.save(u);
    }

    public User find(String username) {
        return userRepo.findByUsername(username).orElse(null);
    }
}