package com.velt.config;

import com.velt.auth.User;
import com.velt.auth.UserRepository;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.time.Duration;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitInterceptor implements HandlerInterceptor {

    private final UserRepository userRepository;

    private final Map<String, Bucket> authIpBuckets = new ConcurrentHashMap<>();
    private final Map<UUID, Bucket> userBuckets = new ConcurrentHashMap<>();

    public RateLimitInterceptor(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    private Bucket createAuthIpBucket() {
        Bandwidth limit = Bandwidth.classic(10, Refill.greedy(10, Duration.ofMinutes(1)));
        return Bucket.builder().addLimit(limit).build();
    }

    private Bucket createFreeTierBucket() {
        Bandwidth limit = Bandwidth.classic(20, Refill.greedy(20, Duration.ofMinutes(1)));
        return Bucket.builder().addLimit(limit).build();
    }

    private Bucket createProTierBucket() {
        Bandwidth limit = Bandwidth.classic(100, Refill.greedy(100, Duration.ofMinutes(1)));
        return Bucket.builder().addLimit(limit).build();
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String uri = request.getRequestURI();

        // 1. Rate limit for public auth endpoints (login & register) by client IP
        if (uri.startsWith("/api/auth/")) {
            String clientIp = getClientIp(request);
            Bucket ipBucket = authIpBuckets.computeIfAbsent(clientIp, k -> createAuthIpBucket());

            if (!ipBucket.tryConsume(1)) {
                sendRateLimitError(response, "Too many authentication requests. Please try again later.");
                return false;
            }
            return true;
        }

        // 2. Rate limit for authenticated users
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && auth.getName() != null && !"anonymousUser".equals(auth.getName())) {
            try {
                UUID userId = UUID.fromString(auth.getName());
                boolean isPro = userRepository.findById(userId)
                        .map(User::getPlan)
                        .filter(plan -> "PRO".equalsIgnoreCase(plan))
                        .isPresent();

                Bucket userBucket = userBuckets.computeIfAbsent(userId, id -> isPro ? createProTierBucket() : createFreeTierBucket());

                if (!userBucket.tryConsume(1)) {
                    sendRateLimitError(response, isPro
                            ? "Rate limit exceeded for your account. Please wait a moment."
                            : "Rate limit exceeded for free tier. Please upgrade your plan or try again later.");
                    return false;
                }
            } catch (IllegalArgumentException ignored) {
                // Principal is not a UUID
            }
        }

        return true;
    }

    private void sendRateLimitError(HttpServletResponse response, String message) throws Exception {
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setContentType("application/json");
        response.setHeader("Retry-After", "60");
        response.getWriter().write("{\"error\": \"" + message + "\"}");
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null || xfHeader.isBlank()) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0].trim();
    }
}
