package com.velt.project;

import com.fasterxml.jackson.databind.JsonNode;
import com.velt.auth.AuthDtos;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public class ProjectDtos {
    public record CreateProjectRequest(
            @NotBlank @Size(max = 4000) String prompt,
            String format,
            String title
    ) {}

    public record RefineRequest(
            @NotBlank @Size(max = 4000) String message
    ) {}

    public record DesignResponse(UUID id, int version, String prompt, JsonNode document, Instant createdAt) {}

    public record MessageResponse(UUID id, String role, String content, Instant createdAt) {}

    public record ProjectSummary(
            UUID id,
            String title,
            String format,
            String prompt,
            String status,
            Instant createdAt,
            Instant updatedAt,
            JsonNode preview
    ) {}

    public record ProjectDetail(
            UUID id,
            String title,
            String format,
            String prompt,
            String status,
            Instant createdAt,
            Instant updatedAt,
            DesignResponse design,
            List<MessageResponse> messages,
            AuthDtos.UserResponse owner
    ) {}

    public record GenerateResponse(ProjectDetail project, int creditsRemaining) {}
}
