package com.velt.generate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class LayoutServiceTest {

    @Mock
    private AiInferenceClient aiInferenceClient;

    private LayoutService layoutService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        layoutService = new LayoutService(objectMapper, aiInferenceClient);
    }

    @Test
    @DisplayName("DIP/SRP: Injects AiInferenceClient abstraction and uses structured synthesis when present")
    void shouldUseInjectedAiInferenceClientWhenPresent() throws Exception {
        String mockResponse = """
                {
                  "format": "website",
                  "name": "Nova",
                  "sections": [
                    { "kind": "hero", "headline": "A New Horizon" }
                  ]
                }
                """;
        JsonNode mockNode = objectMapper.readTree(mockResponse);

        when(aiInferenceClient.completeWithVisionJson(anyString(), anyString(), isNull()))
                .thenReturn(Optional.of(mockNode));

        JsonNode result = layoutService.generate("A minimal pottery studio in Kyoto", "website");

        assertNotNull(result);
        assertEquals("website", result.path("format").asText());
        assertEquals("Nova", result.path("name").asText());
        assertTrue(result.has("sections"));

        verify(aiInferenceClient, times(1))
                .completeWithVisionJson(anyString(), anyString(), isNull());
    }

    @Test
    @DisplayName("DIP/Fallback: Falls back gracefully to heuristic design compiler when AI client returns empty")
    void shouldFallbackToHeuristicWhenAiClientFails() {
        when(aiInferenceClient.completeWithVisionJson(anyString(), anyString(), isNull()))
                .thenReturn(Optional.empty());

        JsonNode result = layoutService.generate("A quiet cafe in Oslo", "website");

        assertNotNull(result);
        assertEquals("website", result.path("format").asText());
        assertTrue(result.has("sections"));
        assertTrue(result.has("theme"));
    }
}
