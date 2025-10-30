package com.nxtclass.dto;

public record StatResponse(
        String label,
        Object value,
        String change,
        String trend
) {
}
