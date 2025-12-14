package com.nxtclass.dto;

public record UserSummary(
        Long id,
        String name,
        String email,
        String role,
        String status,
        String organization,
        String avatarUrl
) {}
