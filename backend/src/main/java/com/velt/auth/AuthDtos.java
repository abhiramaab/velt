package com.velt.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public class AuthDtos {
    public record RegisterRequest(
            @NotBlank @Size(min = 2, max = 80) String name,
            @NotBlank @Email String email,
            @NotBlank @Size(min = 6, max = 80) String password
    ) {}

    public record LoginRequest(
            @NotBlank @Email String email,
            @NotBlank String password
    ) {}

    public record UserResponse(UUID id, String name, String email, String plan, int credits) {
        public static UserResponse from(User user) {
            return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getPlan(), user.getCredits());
        }
    }

    public record AuthResponse(String token, UserResponse user) {}
}
