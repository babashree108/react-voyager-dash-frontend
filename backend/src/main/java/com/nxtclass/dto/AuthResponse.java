package com.nxtclass.dto;

public record AuthResponse(
        String token,
        long expiresIn,
        UserSummary user
) {}
