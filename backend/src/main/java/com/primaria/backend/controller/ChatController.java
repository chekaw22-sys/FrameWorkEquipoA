package com.primaria.backend.controller;

import com.primaria.backend.dto.ChatRequest;
import com.primaria.backend.dto.ChatResponse;
import com.primaria.backend.service.AuthService;
import com.primaria.backend.service.AIService;
import com.primaria.backend.service.ChatService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ChatController {

    private final AuthService authService;
    private final AIService iaService;
    private final ChatService chatService;

    public ChatController(AuthService authService, AIService iaService, ChatService chatService) {
        this.authService = authService;
        this.iaService = iaService;
        this.chatService = chatService;
    }

    @PostMapping
    public ResponseEntity<?> chat(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody ChatRequest request) {
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Token faltante o inválido");
        }

        String token = authHeader.substring(7);
        if (!authService.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Token inválido o expirado");
        }

        String username = authService.extractUsernameFromToken(token);
        String respuestaIA = iaService.getResponse(request.getMessage());

        chatService.save(username, request.getMessage(), respuestaIA);

        return ResponseEntity.ok(new ChatResponse(respuestaIA));
    }

    @GetMapping("/history")
    public ResponseEntity<?> getHistory(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token faltante o inválido");
        }

        String token = authHeader.substring(7);
        if (!authService.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token inválido o expirado");
        }

        String username = authService.extractUsernameFromToken(token);
        return ResponseEntity.ok(chatService.getHistoryByUsername(username));
    }
}



