package com.nxtclass.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secret", "mySecretKey123456789012345678901234567890");
        ReflectionTestUtils.setField(jwtService, "expiration", 86400000L); // 24 hours
    }

    @Test
    void generateToken_ShouldReturnValidToken() {
        // Given
        String email = "test@example.com";

        // When
        String token = jwtService.generateToken(email);

        // Then
        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    void extractUsername_ShouldReturnCorrectEmail() {
        // Given
        String email = "test@example.com";
        String token = jwtService.generateToken(email);

        // When
        String extractedEmail = jwtService.extractUsername(token);

        // Then
        assertEquals(email, extractedEmail);
    }

    @Test
    void validateToken_WithValidToken_ShouldReturnTrue() {
        // Given
        String email = "test@example.com";
        String token = jwtService.generateToken(email);

        // When
        boolean isValid = jwtService.validateToken(token, email);

        // Then
        assertTrue(isValid);
    }

    @Test
    void validateToken_WithInvalidEmail_ShouldReturnFalse() {
        // Given
        String email = "test@example.com";
        String wrongEmail = "wrong@example.com";
        String token = jwtService.generateToken(email);

        // When
        boolean isValid = jwtService.validateToken(token, wrongEmail);

        // Then
        assertFalse(isValid);
    }

    @Test
    void extractExpiration_ShouldReturnFutureDate() {
        // Given
        String email = "test@example.com";
        String token = jwtService.generateToken(email);

        // When
        Date expiration = jwtService.extractExpiration(token);

        // Then
        assertNotNull(expiration);
        assertTrue(expiration.after(new Date()));
    }
}