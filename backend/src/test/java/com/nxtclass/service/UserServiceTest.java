package com.nxtclass.service;

import com.nxtclass.dto.LoginRequest;
import com.nxtclass.dto.UserDto;
import com.nxtclass.entity.User;
import com.nxtclass.entity.UserRole;
import com.nxtclass.entity.UserStatus;
import com.nxtclass.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private UserService userService;

    private User testUser;
    private UserDto testUserDto;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setName("John Doe");
        testUser.setEmail("john@test.com");
        testUser.setPassword("encodedPassword");
        testUser.setRole(UserRole.TEACHER);
        testUser.setStatus(UserStatus.ACTIVE);
        testUser.setOrganization("Test School");
        testUser.setCreatedAt(LocalDateTime.now());
        testUser.setUpdatedAt(LocalDateTime.now());

        testUserDto = new UserDto();
        testUserDto.setName("John Doe");
        testUserDto.setEmail("john@test.com");
        testUserDto.setPassword("password");
        testUserDto.setRole(UserRole.TEACHER);
        testUserDto.setOrganization("Test School");
    }

    @Test
    void getAllUsers_ShouldReturnAllUsers() {
        // Given
        List<User> users = Arrays.asList(testUser);
        when(userRepository.findAll()).thenReturn(users);

        // When
        List<UserDto> result = userService.getAllUsers();

        // Then
        assertEquals(1, result.size());
        assertEquals("John Doe", result.get(0).getName());
        assertEquals("john@test.com", result.get(0).getEmail());
        assertEquals(UserRole.TEACHER, result.get(0).getRole());
    }

    @Test
    void getUserById_WhenUserExists_ShouldReturnUser() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        // When
        Optional<UserDto> result = userService.getUserById(1L);

        // Then
        assertTrue(result.isPresent());
        assertEquals("John Doe", result.get().getName());
        assertEquals("john@test.com", result.get().getEmail());
    }

    @Test
    void getUserById_WhenUserNotExists_ShouldReturnEmpty() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        // When
        Optional<UserDto> result = userService.getUserById(1L);

        // Then
        assertFalse(result.isPresent());
    }

    @Test
    void getUserByEmail_WhenUserExists_ShouldReturnUser() {
        // Given
        when(userRepository.findByEmail("john@test.com")).thenReturn(Optional.of(testUser));

        // When
        Optional<UserDto> result = userService.getUserByEmail("john@test.com");

        // Then
        assertTrue(result.isPresent());
        assertEquals("John Doe", result.get().getName());
    }

    @Test
    void getUsersByRole_ShouldReturnUsersWithSpecificRole() {
        // Given
        List<User> teachers = Arrays.asList(testUser);
        when(userRepository.findByRole(UserRole.TEACHER)).thenReturn(teachers);

        // When
        List<UserDto> result = userService.getUsersByRole(UserRole.TEACHER);

        // Then
        assertEquals(1, result.size());
        assertEquals(UserRole.TEACHER, result.get(0).getRole());
    }

    @Test
    void createUser_ShouldCreateAndReturnUser() {
        // Given
        when(passwordEncoder.encode("password")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // When
        UserDto result = userService.createUser(testUserDto);

        // Then
        assertNotNull(result);
        assertEquals("John Doe", result.getName());
        assertEquals("john@test.com", result.getEmail());
        verify(passwordEncoder).encode("password");
        verify(userRepository).save(any(User.class));
    }

    @Test
    void updateUser_WhenUserExists_ShouldUpdateAndReturnUser() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // When
        Optional<UserDto> result = userService.updateUser(1L, testUserDto);

        // Then
        assertTrue(result.isPresent());
        assertEquals("John Doe", result.get().getName());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void updateUser_WhenUserNotExists_ShouldReturnEmpty() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        // When
        Optional<UserDto> result = userService.updateUser(1L, testUserDto);

        // Then
        assertFalse(result.isPresent());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void deleteUser_WhenUserExists_ShouldReturnTrue() {
        // Given
        when(userRepository.existsById(1L)).thenReturn(true);

        // When
        boolean result = userService.deleteUser(1L);

        // Then
        assertTrue(result);
        verify(userRepository).deleteById(1L);
    }

    @Test
    void deleteUser_WhenUserNotExists_ShouldReturnFalse() {
        // Given
        when(userRepository.existsById(1L)).thenReturn(false);

        // When
        boolean result = userService.deleteUser(1L);

        // Then
        assertFalse(result);
        verify(userRepository, never()).deleteById(1L);
    }

    @Test
    void authenticate_WithValidCredentials_ShouldReturnLoginResponse() {
        // Given
        LoginRequest loginRequest = new LoginRequest("john@test.com", "password");
        when(userRepository.findByEmail("john@test.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("password", "encodedPassword")).thenReturn(true);
        when(jwtService.generateToken("john@test.com")).thenReturn("jwtToken");

        // When
        var result = userService.authenticate(loginRequest);

        // Then
        assertNotNull(result);
        assertEquals("jwtToken", result.getToken());
        assertEquals("John Doe", result.getName());
        assertEquals("john@test.com", result.getEmail());
        assertEquals(UserRole.TEACHER, result.getRole());
    }

    @Test
    void authenticate_WithInvalidCredentials_ShouldThrowException() {
        // Given
        LoginRequest loginRequest = new LoginRequest("john@test.com", "wrongPassword");
        when(userRepository.findByEmail("john@test.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("wrongPassword", "encodedPassword")).thenReturn(false);

        // When & Then
        assertThrows(RuntimeException.class, () -> userService.authenticate(loginRequest));
    }
}