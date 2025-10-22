package com.nxtclass.dto;

import com.nxtclass.entity.UserRole;
import com.nxtclass.entity.UserStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class UserDto {
    private Long id;
    
    @NotBlank(message = "Name is required")
    private String name;
    
    @Email(message = "Email should be valid")
    @NotBlank(message = "Email is required")
    private String email;
    
    @NotBlank(message = "Password is required")
    private String password;
    
    @NotNull(message = "Role is required")
    private UserRole role;
    
    private UserStatus status;
    private String avatarUrl;
    private String organization;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Custom constructor for convenience
    public UserDto(Long id, String name, String email, UserRole role, UserStatus status, 
                   String avatarUrl, String organization) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.status = status;
        this.avatarUrl = avatarUrl;
        this.organization = organization;
    }
}