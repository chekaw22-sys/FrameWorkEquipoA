package com.primaria.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;
import org.springframework.http.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

@Service
public class AIService {

    private final String iaUrl = System.getenv().getOrDefault("IA_URL", "http://localhost:5005");
    private final String iaSecret = System.getenv().getOrDefault("IA_SECRET", "SECRET_KEY_INTERNAL");

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Envía un mensaje a la IA y devuelve su respuesta.
     */
    public String getResponse(String mensajeUsuario) {
        try {
            // Construimos el JSON a enviar
            ObjectNode json = objectMapper.createObjectNode();
            json.put("message", mensajeUsuario);
            json.put("token", iaSecret);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            String jsonString = objectMapper.writeValueAsString(json);
            HttpEntity<String> request = new HttpEntity<>(jsonString, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(iaUrl, request, String.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                JsonNode respJson = objectMapper.readTree(response.getBody());
                String iaResp = respJson.path("response").asText("Respuesta inválida de la IA");
                return iaResp;
            } else {
                return "Error: no se pudo comunicar con la IA (HTTP " + response.getStatusCode() + ")";
            }

        } catch (RestClientException e) {
            return "Error de conexión con la IA: " + e.getMessage();
        } catch (Exception e) {
            return "Error inesperado al comunicarse con la IA: " + e.getMessage();
        }
    }
}

