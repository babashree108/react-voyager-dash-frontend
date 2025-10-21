package com.nxtclass.dto;

public class StatDto {
    private String label;
    private Object value;
    private String change;
    private String trend;

    // Constructors
    public StatDto() {}

    public StatDto(String label, Object value, String change, String trend) {
        this.label = label;
        this.value = value;
        this.change = change;
        this.trend = trend;
    }

    // Getters and Setters
    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public Object getValue() {
        return value;
    }

    public void setValue(Object value) {
        this.value = value;
    }

    public String getChange() {
        return change;
    }

    public void setChange(String change) {
        this.change = change;
    }

    public String getTrend() {
        return trend;
    }

    public void setTrend(String trend) {
        this.trend = trend;
    }
}