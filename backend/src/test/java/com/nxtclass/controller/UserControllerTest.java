package com.nxtclass.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nxtclass.dto.UserDto;
import com.nxtclass.entity.UserRole;
import com.nxtclass.entity.UserStatus;
import com.nxtclass.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void getAllUsers_ShouldReturnAllUsers() throws Exception {
        // Given
        UserDto user1 = createUserDto(1L, "John Admin", "admin@school.com", UserRole.ORGADMIN);
        UserDto user2 = createUserDto(2L, "Sarah Teacher", "sarah@school.com", UserRole.TEACHER);
        List<UserDto> users = Arrays.asList(user1, user2);
        
        when(userService.getAllUsers()).thenReturn(users);

        // When & Then
        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].name").value("John Admin"))
                .andExpect(jsonPath("$[0].role").value("ORGADMIN"))
                .andExpect(jsonPath("$[1].name").value("Sarah Teacher"))
                .andExpect(jsonPath("$[1].role").value("TEACHER"));
    }

    @Test
    void getUserById_WhenUserExists_ShouldReturnUser() throws Exception {
        // Given
        UserDto user = createUserDto(1L, "John Admin", "admin@school.com", UserRole.ORGADMIN);
        when(userService.getUserById(1L)).thenReturn(Optional.of(user));

        // When & Then
        mockMvc.perform(get("/api/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("John Admin"))
                .andExpect(jsonPath("$.email").value("admin@school.com"))
                .andExpect(jsonPath("$.role").value("ORGADMIN"));
    }

    @Test
    void getUserById_WhenUserNotExists_ShouldReturnNotFound() throws Exception {
        // Given
        when(userService.getUserById(1L)).thenReturn(Optional.empty());

        // When & Then
        mockMvc.perform(get("/api/users/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    void getUsersByRole_ShouldReturnUsersWithSpecificRole() throws Exception {
        // Given
        UserDto teacher = createUserDto(1L, "Sarah Teacher", "sarah@school.com", UserRole.TEACHER);
        List<UserDto> teachers = Arrays.asList(teacher);
        
        when(userService.getUsersByRole(UserRole.TEACHER)).thenReturn(teachers);

        // When & Then
        mockMvc.perform(get("/api/users/role/TEACHER"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].role").value("TEACHER"));
    }

    @Test
    void createUser_ShouldCreateAndReturnUser() throws Exception {
        // Given
        UserDto userDto = createUserDto(null, "New User", "new@school.com", UserRole.STUDENT);
        UserDto createdUser = createUserDto(1L, "New User", "new@school.com", UserRole.STUDENT);
        
        when(userService.createUser(any(UserDto.class))).thenReturn(createdUser);

        // When & Then
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(userDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("New User"))
                .andExpect(jsonPath("$.email").value("new@school.com"))
                .andExpect(jsonPath("$.role").value("STUDENT"));
    }

    @Test
    void updateUser_WhenUserExists_ShouldUpdateAndReturnUser() throws Exception {
        // Given
        UserDto userDto = createUserDto(1L, "Updated User", "updated@school.com", UserRole.TEACHER);
        
        when(userService.updateUser(anyLong(), any(UserDto.class))).thenReturn(Optional.of(userDto));

        // When & Then
        mockMvc.perform(put("/api/users/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(userDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated User"))
                .andExpect(jsonPath("$.email").value("updated@school.com"));
    }

    @Test
    void updateUser_WhenUserNotExists_ShouldReturnNotFound() throws Exception {
        // Given
        UserDto userDto = createUserDto(1L, "Updated User", "updated@school.com", UserRole.TEACHER);
        
        when(userService.updateUser(anyLong(), any(UserDto.class))).thenReturn(Optional.empty());

        // When & Then
        mockMvc.perform(put("/api/users/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(userDto)))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteUser_WhenUserExists_ShouldReturnNoContent() throws Exception {
        // Given
        when(userService.deleteUser(1L)).thenReturn(true);

        // When & Then
        mockMvc.perform(delete("/api/users/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void deleteUser_WhenUserNotExists_ShouldReturnNotFound() throws Exception {
        // Given
        when(userService.deleteUser(1L)).thenReturn(false);

        // When & Then
        mockMvc.perform(delete("/api/users/1"))
                .andExpect(status().isNotFound());
    }

    private UserDto createUserDto(Long id, String name, String email, UserRole role) {
        UserDto userDto = new UserDto();
        userDto.setId(id);
        userDto.setName(name);
        userDto.setEmail(email);
        userDto.setPassword("password");
        userDto.setRole(role);
        userDto.setStatus(UserStatus.ACTIVE);
        userDto.setOrganization("Test School");
        userDto.setCreatedAt(LocalDateTime.now());
        userDto.setUpdatedAt(LocalDateTime.now());
        return userDto;
    }
}