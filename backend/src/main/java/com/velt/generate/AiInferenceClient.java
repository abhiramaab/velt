package com.velt.generate;

import com.fasterxml.jackson.databind.JsonNode;

import java.util.Optional;

/**
 * High-level abstraction for AI LLM inference clients (DIP & OCP).
 * Enables swapping model backends (OpenAI, xAI, Mock stubs) without touching LayoutService.
 */
public interface AiInferenceClient {

    /**
     * Returns true if API credentials and endpoints are configured and enabled.
     */
    boolean enabled();

    /**
     * Synthesizes structured JSON document completions.
     *
     * @param system system prompt instructions
     * @param user   user intent and context
     * @return parsed JSON root node if successful
     */
    Optional<JsonNode> completeJson(String system, String user);

    /**
     * Synthesizes structured JSON document completions with optional vision reference.
     *
     * @param system   system prompt instructions
     * @param user     user intent and context
     * @param imageUrl optional reference image URL
     * @return parsed JSON root node if successful
     */
    Optional<JsonNode> completeWithVisionJson(String system, String user, String imageUrl);
}
