package com.primaria.backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private static final String SECRET = "12345678901234567890123456789012"; // 32 chars
    private static final long EXPIRATION = 86400000; // 1 día

    private final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());

    // Genera un token JWT
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(key)
                .compact();
    }

    // Extrae el username del token
    public String extractUsername(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
        } catch (JwtException | IllegalArgumentException ex) {
            return null;
        }
    }

    // Comprueba si el token ha expirado
    public boolean isTokenExpired(String token) {
        try {
            Date expiration = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getExpiration();
            return expiration.before(new Date());
        } catch (JwtException | IllegalArgumentException ex) {
            return true; // Considera inválido si ocurre cualquier error
        }
    }

    // Validación combinada (opcional)
    public boolean validateToken(String token) {
        String username = extractUsername(token);
        return username != null && !isTokenExpired(token);
    }
}
