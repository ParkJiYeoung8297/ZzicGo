package com.ZzicGo.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Component
public class CursorEncoder {

    private final ObjectMapper mapper = new ObjectMapper();

    public String encode(LocalDateTime createdAt, Long id) {
        try {
            Map<String, Object> json = new HashMap<>();
            json.put("createdAt", createdAt.toString());
            json.put("id", id);

            String str = mapper.writeValueAsString(json);
            return Base64.getUrlEncoder().encodeToString(str.getBytes());
        } catch (Exception e) {
            throw new RuntimeException("Cursor encoding failed");
        }
    }

    public Cursor decode(String cursor) {
        if (cursor == null || cursor.isBlank()) return null;
        try {
            String json = new String(Base64.getUrlDecoder().decode(cursor));
            JsonNode node = mapper.readTree(json);

            return new Cursor(
                    LocalDateTime.parse(node.get("createdAt").asText()),
                    node.get("id").asLong()
            );
        } catch (Exception e) {
            throw new RuntimeException("Invalid cursor");
        }
    }


}

