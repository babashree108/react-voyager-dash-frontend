package com.nxtclass.controller;

import com.nxtclass.dto.AuthRequest;
import com.nxtclass.dto.AuthResponse;
import com.nxtclass.dto.UserSummary;
import com.nxtclass.entity.User;
import com.nxtclass.entity.UserStatus;
import com.nxtclass.repository.UserRepository;
import com.nxtclass.security.JwtService;
import jakarta.validation.Valid;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Locale;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    public AuthController(
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            UserRepository userRepository
    ) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.email(), request.password())
            );

            String email = authentication.getName();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

            if (user.getStatus() != UserStatus.ACTIVE) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("User account is not active");
            }

            String token = jwtService.generateToken((org.springframework.security.core.userdetails.UserDetails) authentication.getPrincipal());

        UserSummary userSummary = new UserSummary(
            user.getIdentifier(),
                    user.getName(),
                    user.getEmail(),
                    user.getRole().name().toLowerCase(Locale.ROOT),
                    user.getStatus().name().toLowerCase(Locale.ROOT),
                    user.getOrganization(),
                    user.getAvatarUrl()
            );

        AuthResponse response = new AuthResponse(token, jwtService.getExpirationMillis(), userSummary);
        return ResponseEntity.ok()
            .cacheControl(CacheControl.noStore())
            .header(HttpHeaders.PRAGMA, "no-cache")
            .header(HttpHeaders.EXPIRES, "0")
            .body(response);
        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }
    }
}
