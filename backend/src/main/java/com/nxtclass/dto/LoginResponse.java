package com.nxtclass.dto;

import com.nxtclass.entity.UserRole;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
public class LoginResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String name;
    private String email;
    private UserRole role;
    private String organization;

    // Custom constructor for convenience
    public LoginResponse(String token, Long id, String name, String email, UserRole role, String organization) {
        this.token = token;
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.organization = organization;
    }
}