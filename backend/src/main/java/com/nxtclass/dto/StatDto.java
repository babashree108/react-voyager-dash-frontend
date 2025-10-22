package com.nxtclass.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
public class StatDto {
    private String label;
    private Object value;
    private String change;
    private String trend;

    // Custom constructor for convenience
    public StatDto(String label, Object value, String change, String trend) {
        this.label = label;
        this.value = value;
        this.change = change;
        this.trend = trend;
    }
}