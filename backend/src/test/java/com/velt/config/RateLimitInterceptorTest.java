package com.velt.config;

import com.velt.auth.User;
import com.velt.auth.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RateLimitInterceptorTest {

    @Mock
    private UserRepository userRepository;

    private RateLimitInterceptor interceptor;

    @BeforeEach
    void setUp() {
        interceptor = new RateLimitInterceptor(userRepository);
        SecurityContextHolder.clearContext();
    }

    @Test
    void testAuthRateLimitExceededAfter10Requests() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/auth/login");
        request.setRemoteAddr("192.168.1.100");

        for (int i = 0; i < 10; i++) {
            MockHttpServletResponse response = new MockHttpServletResponse();
            assertTrue(interceptor.preHandle(request, response, new Object()));
        }

        MockHttpServletResponse rejectedResponse = new MockHttpServletResponse();
        assertFalse(interceptor.preHandle(request, rejectedResponse, new Object()));
        assertEquals(429, rejectedResponse.getStatus());
        assertTrue(rejectedResponse.getContentAsString().contains("Too many authentication requests"));
    }

    @Test
    void testFreeUserRateLimitExceededAfter20Requests() throws Exception {
        UUID userId = UUID.randomUUID();
        User freeUser = new User();
        freeUser.setPlan("FREE");
        when(userRepository.findById(userId)).thenReturn(Optional.of(freeUser));

        var auth = new UsernamePasswordAuthenticationToken(userId.toString(), null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/projects");

        for (int i = 0; i < 20; i++) {
            MockHttpServletResponse response = new MockHttpServletResponse();
            assertTrue(interceptor.preHandle(request, response, new Object()));
        }

        MockHttpServletResponse rejectedResponse = new MockHttpServletResponse();
        assertFalse(interceptor.preHandle(request, rejectedResponse, new Object()));
        assertEquals(429, rejectedResponse.getStatus());
        assertTrue(rejectedResponse.getContentAsString().contains("Rate limit exceeded for free tier"));
    }
}
