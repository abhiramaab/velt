package com.velt.auth;

import com.velt.common.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class AuthService {
    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public AuthService(UserRepository users, PasswordEncoder encoder, JwtService jwt) {
        this.users = users;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    @Transactional
    public AuthDtos.AuthResponse register(AuthDtos.RegisterRequest request) {
        if (users.existsByEmailIgnoreCase(request.email())) {
            throw new ApiException(HttpStatus.CONFLICT, "An account with that email already exists.");
        }
        User user = new User();
        user.setName(request.name().trim());
        user.setEmail(request.email().trim().toLowerCase());
        user.setPasswordHash(encoder.encode(request.password()));
        user.setPlan("FREE");
        user.setCredits(40);
        users.save(user);
        return new AuthDtos.AuthResponse(jwt.issue(user), AuthDtos.UserResponse.from(user));
    }

    public AuthDtos.AuthResponse login(AuthDtos.LoginRequest request) {
        User user = users.findByEmailIgnoreCase(request.email())
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password."));
        if (!encoder.matches(request.password(), user.getPasswordHash())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password.");
        }
        return new AuthDtos.AuthResponse(jwt.issue(user), AuthDtos.UserResponse.from(user));
    }

    public AuthDtos.UserResponse me(UUID userId) {
        User user = users.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Session expired."));
        return AuthDtos.UserResponse.from(user);
    }
}
