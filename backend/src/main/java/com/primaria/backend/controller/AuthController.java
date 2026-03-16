package com.primaria.backend.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.primaria.backend.dto.AuthRequest;
import com.primaria.backend.service.AuthService;
import com.primaria.backend.service.UserService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AuthController {

    private final UserService userService;
    private final AuthService authService;

    public AuthController(UserService userService, AuthService authService) {
        this.userService = userService;
        this.authService = authService;
    }

    @PostMapping("/register")
    public Map<String, String> register(@RequestBody AuthRequest req) {
        try {
            if (req == null || req.getUsername() == null || req.getUsername().isBlank() || req.getPassword() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "username/password requeridos");
            }
            userService.register(req.getUsername(), req.getPassword());
            return Map.of("status", "OK", "message", "Usuario registrado correctamente");
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Error al registrar usuario: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody AuthRequest req) {
        try {
            if (req == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Body requerido");
            }
            String token = authService.login(req.getUsername(), req.getPassword());
            if (token == null) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario o contraseña inválidos");
            }
            return Map.of("token", token);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Error en login: " + e.getMessage());
        }
    }
}