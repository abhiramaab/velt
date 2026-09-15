package com.velt.generate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Component
public class XaiClient {
    private final RestClient http;
    private final ObjectMapper mapper;
    private final String apiKey;
    private final String model;

    public XaiClient(
            ObjectMapper mapper,
            @Value("${velt.xai.api-key}") String apiKey,
            @Value("${velt.xai.model}") String model,
            @Value("${velt.xai.base-url}") String baseUrl
    ) {
        this.mapper = mapper;
        this.apiKey = apiKey == null ? "" : apiKey.trim();
        this.model = model;
        this.http = RestClient.builder().baseUrl(baseUrl).build();
    }

    public boolean enabled() {
        return !apiKey.isBlank();
    }

    public Optional<JsonNode> completeJson(String system, String user) {
        if (!enabled()) {
            return Optional.empty();
        }
        try {
            Map<String, Object> body = Map.of(
                    "model", model,
                    "temperature", 0.7,
                    "response_format", Map.of("type", "json_object"),
                    "messages", List.of(
                            Map.of("role", "system", "content", system),
                            Map.of("role", "user", "content", user)
                    )
            );
            String raw = http.post()
                    .uri("/chat/completions")
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer " + apiKey)
                    .body(body)
                    .retrieve()
                    .body(String.class);
            JsonNode root = mapper.readTree(raw);
            String content = root.path("choices").path(0).path("message").path("content").asText("");
            if (content.isBlank()) {
                return Optional.empty();
            }
            String json = extractJson(content);
            return Optional.of(mapper.readTree(json));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    private static String extractJson(String content) {
        String trimmed = content.trim();
        if (trimmed.startsWith("```")) {
            int start = trimmed.indexOf('{');
            int end = trimmed.lastIndexOf('}');
            if (start >= 0 && end > start) {
                return trimmed.substring(start, end + 1);
            }
        }
        return trimmed;
    }
}
