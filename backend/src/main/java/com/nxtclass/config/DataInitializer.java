package com.nxtclass.config;

import com.nxtclass.entity.User;
import com.nxtclass.entity.UserRole;
import com.nxtclass.entity.UserStatus;
import com.nxtclass.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.password.PasswordEncoder;

@Component
public class DataInitializer implements CommandLineRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedUser("admin@nxtclass.com", "Platform Admin", UserRole.ORGADMIN, "Admin@123");
        seedUser("teacher@nxtclass.com", "Lead Teacher", UserRole.TEACHER, "Admin@123");
        seedUser("student@nxtclass.com", "Student One", UserRole.STUDENT, "Admin@123");
    }

    private void seedUser(String email, String name, UserRole role, String rawPassword) {
        userRepository.findByEmail(email).orElseGet(() -> {
            User user = new User();
            user.setName(name);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(rawPassword));
            user.setRole(role);
            user.setStatus(UserStatus.ACTIVE);
            user.setOrganization("NXT Class");
            return userRepository.save(user);
        });
    }
}
