# 🛠️ Security Implementation Guide - Quick Start

This guide provides **step-by-step implementation** for fixing critical security vulnerabilities in the NXT Class platform.

---

## 🎯 Phase 1: Critical Security Fixes (DO FIRST)

### Fix 1: Enable Method-Level Security (RBAC)

#### Step 1.1: Update SecurityConfig.java

```java
package com.nxtclass.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;  // ADD THIS
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.beans.factory.annotation.Value;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)  // ADD THIS LINE
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtAuthenticationEntryPoint authenticationEntryPoint;
    private final UserDetailsService userDetailsService;

    @Value("${cors.allowed.origins:http://localhost:5173,http://localhost:8081}")
    private String corsAllowedOrigins;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter,
            JwtAuthenticationEntryPoint authenticationEntryPoint,
            UserDetailsService userDetailsService
    ) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.authenticationEntryPoint = authenticationEntryPoint;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(exception -> exception.authenticationEntryPoint(authenticationEntryPoint))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/actuator/health").permitAll()
                        .requestMatchers("/actuator/**").hasRole("ORGADMIN")  // ADD THIS
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .anyRequest().authenticated()
                )
                .headers(headers -> headers  // ADD SECURITY HEADERS
                        .frameOptions(frame -> frame.deny())
                        .xssProtection(xss -> xss.disable())  // Handled by frontend
                        .contentTypeOptions(contentType -> contentType.disable())
                )
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        String[] origins = corsAllowedOrigins.split(",");
        configuration.setAllowedOrigins(Arrays.asList(origins));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

#### Step 1.2: Update CourseController.java

```java
package com.nxtclass.controller;

import com.nxtclass.dto.CourseDTO;
import com.nxtclass.service.CourseAPI;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/course")
public class CourseController {
    private final CourseAPI courseAPI;

    public CourseController(CourseAPI courseAPI) {
        this.courseAPI = courseAPI;
    }

    @PreAuthorize("hasAnyRole('ORGADMIN', 'TEACHER', 'STUDENT')")
    @GetMapping("list")
    public ResponseEntity<List<CourseDTO>> list() {
        List<CourseDTO> course = courseAPI.list();
        return ResponseEntity.ok(course);
    }

    @PreAuthorize("hasAnyRole('ORGADMIN', 'TEACHER', 'STUDENT')")
    @GetMapping("count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(courseAPI.list().stream().count());
    }

    @PreAuthorize("hasAnyRole('ORGADMIN', 'TEACHER')")
    @PostMapping("save")
    public ResponseEntity<Long> save(@Valid @RequestBody CourseDTO dto) {
        return ResponseEntity.ok(courseAPI.save(dto));
    }

    @PreAuthorize("hasAnyRole('ORGADMIN', 'TEACHER')")
    @PutMapping("update")
    public ResponseEntity<?> update(@Valid @RequestBody CourseDTO dto) {
        return (dto.getIdentifier() == null)
                ? ResponseEntity.badRequest().body("Identifier is required for update.")
                : ResponseEntity.ok(courseAPI.save(dto));
    }

    @PreAuthorize("hasAnyRole('ORGADMIN', 'TEACHER', 'STUDENT')")
    @GetMapping("/{identifier}")
    public ResponseEntity<?> getDetails(@PathVariable Long identifier) {
        try {
            CourseDTO dto = courseAPI.details(identifier);
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PreAuthorize("hasRole('ORGADMIN')")
    @DeleteMapping("/{identifier}")
    public ResponseEntity<String> delete(@PathVariable Long identifier) {
        try {
            String result = courseAPI.delete(identifier);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
```

#### Step 1.3: Update StudentDetailsController.java

```java
package com.nxtclass.controller;

import com.nxtclass.dto.StudentDetailsDTO;
import com.nxtclass.service.StudentDetailsAPI;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/student-details")
public class StudentDetailsController {
    private final StudentDetailsAPI studentDetailsAPI;

    @PreAuthorize("hasAnyRole('ORGADMIN', 'TEACHER')")
    @GetMapping("list")
    public ResponseEntity<List<StudentDetailsDTO>> list() {
        List<StudentDetailsDTO> students = studentDetailsAPI.list();
        return ResponseEntity.ok(students);
    }

    @PreAuthorize("hasAnyRole('ORGADMIN', 'TEACHER')")
    @GetMapping("count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(studentDetailsAPI.list().stream().count());
    }

    @PreAuthorize("hasRole('ORGADMIN')")
    @PostMapping("save")
    public ResponseEntity<Long> save(@Valid @RequestBody StudentDetailsDTO dto) {
        return ResponseEntity.ok(studentDetailsAPI.save(dto));
    }

    @PreAuthorize("hasRole('ORGADMIN')")
    @PutMapping("update")
    public ResponseEntity<?> update(@Valid @RequestBody StudentDetailsDTO dto) {
        return (dto.getIdentifier() == null)
                ? ResponseEntity.badRequest().body("Identifier is required for update.")
                : ResponseEntity.ok(studentDetailsAPI.save(dto));
    }

    @PreAuthorize("hasAnyRole('ORGADMIN', 'TEACHER')")
    @GetMapping("/{identifier}")
    public ResponseEntity<?> getDetails(@PathVariable Long identifier) {
        try {
            StudentDetailsDTO dto = studentDetailsAPI.details(identifier);
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PreAuthorize("hasRole('ORGADMIN')")
    @DeleteMapping("/{identifier}")
    public ResponseEntity<String> delete(@PathVariable Long identifier) {
        try {
            String result = studentDetailsAPI.delete(identifier);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
```

#### Step 1.4: Update TeacherDetailsController.java

```java
package com.nxtclass.controller;

import com.nxtclass.dto.TeacherDetailsDTO;
import com.nxtclass.service.impl.TeacherDetailsAPI;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/teacher-details")
public class TeacherDetailsController {
    private final TeacherDetailsAPI teacherDetailsAPI;

    @PreAuthorize("hasAnyRole('ORGADMIN', 'TEACHER')")
    @GetMapping("list")
    public ResponseEntity<List<TeacherDetailsDTO>> list() {
        List<TeacherDetailsDTO> teachers = teacherDetailsAPI.list();
        return ResponseEntity.ok(teachers);
    }

    @PreAuthorize("hasAnyRole('ORGADMIN', 'TEACHER')")
    @GetMapping("count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(teacherDetailsAPI.list().stream().count());
    }

    @PreAuthorize("hasRole('ORGADMIN')")
    @PostMapping("save")
    public ResponseEntity<Long> save(@Valid @RequestBody TeacherDetailsDTO dto) {
        return ResponseEntity.ok(teacherDetailsAPI.save(dto));
    }

    @PreAuthorize("hasRole('ORGADMIN')")
    @PutMapping("update")
    public ResponseEntity<?> update(@Valid @RequestBody TeacherDetailsDTO dto) {
        return (dto.getIdentifier() == null)
                ? ResponseEntity.badRequest().body("Identifier is required for update.")
                : ResponseEntity.ok(teacherDetailsAPI.save(dto));
    }

    @PreAuthorize("hasAnyRole('ORGADMIN', 'TEACHER')")
    @GetMapping("/{identifier}")
    public ResponseEntity<?> getDetails(@PathVariable Long identifier) {
        try {
            TeacherDetailsDTO dto = teacherDetailsAPI.details(identifier);
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PreAuthorize("hasRole('ORGADMIN')")
    @DeleteMapping("/{identifier}")
    public ResponseEntity<String> delete(@PathVariable Long identifier) {
        try {
            String result = teacherDetailsAPI.delete(identifier);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
```

#### Step 1.5: Update AnnouncementController.java

```java
package com.nxtclass.controller;

import com.nxtclass.entity.Announcement;
import com.nxtclass.repository.AnnouncementRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/announcements")
public class AnnouncementController {
    
    @Autowired
    private AnnouncementRepository announcementRepository;

    @PreAuthorize("hasAnyRole('ORGADMIN', 'TEACHER', 'STUDENT')")
    @GetMapping
    public ResponseEntity<List<Announcement>> getAllAnnouncements() {
        List<Announcement> announcements = announcementRepository.findAll();
        return ResponseEntity.ok(announcements);
    }

    @PreAuthorize("hasAnyRole('ORGADMIN', 'TEACHER', 'STUDENT')")
    @GetMapping("/{id}")
    public ResponseEntity<Announcement> getAnnouncementById(@PathVariable Long id) {
        Optional<Announcement> announcement = announcementRepository.findById(id);
        return announcement.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasAnyRole('ORGADMIN', 'TEACHER', 'STUDENT')")
    @GetMapping("/author/{author}")
    public ResponseEntity<List<Announcement>> getAnnouncementsByAuthor(@PathVariable String author) {
        List<Announcement> announcements = announcementRepository.findByAuthor(author);
        return ResponseEntity.ok(announcements);
    }

    @PreAuthorize("hasAnyRole('ORGADMIN', 'TEACHER', 'STUDENT')")
    @GetMapping("/recent")
    public ResponseEntity<List<Announcement>> getRecentAnnouncements() {
        List<Announcement> announcements = announcementRepository.findRecentAnnouncements(LocalDate.now().minusDays(30));
        return ResponseEntity.ok(announcements);
    }

    @PreAuthorize("hasAnyRole('ORGADMIN', 'TEACHER')")
    @PostMapping
    public ResponseEntity<Announcement> createAnnouncement(@Valid @RequestBody Announcement announcement) {
        Announcement savedAnnouncement = announcementRepository.save(announcement);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedAnnouncement);
    }

    @PreAuthorize("hasAnyRole('ORGADMIN', 'TEACHER')")
    @PutMapping("/{id}")
    public ResponseEntity<Announcement> updateAnnouncement(@PathVariable Long id, @Valid @RequestBody Announcement announcement) {
        if (announcementRepository.existsById(id)) {
            announcement.setId(id);
            Announcement updatedAnnouncement = announcementRepository.save(announcement);
            return ResponseEntity.ok(updatedAnnouncement);
        }
        return ResponseEntity.notFound().build();
    }

    @PreAuthorize("hasRole('ORGADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAnnouncement(@PathVariable Long id) {
        if (announcementRepository.existsById(id)) {
            announcementRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
```

#### Step 1.6: Update AssignmentController.java

```java
package com.nxtclass.controller;

import com.nxtclass.entity.Assignment;
import com.nxtclass.entity.AssignmentStatus;
import com.nxtclass.repository.AssignmentRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {
    
    @Autowired
    private AssignmentRepository assignmentRepository;

    @PreAuthorize("hasAnyRole('ORGADMIN', 'TEACHER', 'STUDENT')")
    @GetMapping
    public ResponseEntity<List<Assignment>> getAllAssignments() {
        List<Assignment> assignments = assignmentRepository.findAll();
        return ResponseEntity.ok(assignments);
    }

    @PreAuthorize("hasAnyRole('ORGADMIN', 'TEACHER', 'STUDENT')")
    @GetMapping("/{id}")
    public ResponseEntity<Assignment> getAssignmentById(@PathVariable Long id) {
        Optional<Assignment> assignment = assignmentRepository.findById(id);
        return assignment.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasAnyRole('ORGADMIN', 'TEACHER', 'STUDENT')")
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Assignment>> getAssignmentsByStatus(@PathVariable AssignmentStatus status) {
        List<Assignment> assignments = assignmentRepository.findByStatus(status);
        return ResponseEntity.ok(assignments);
    }

    @PreAuthorize("hasAnyRole('ORGADMIN', 'TEACHER', 'STUDENT')")
    @GetMapping("/subject/{subject}")
    public ResponseEntity<List<Assignment>> getAssignmentsBySubject(@PathVariable String subject) {
        List<Assignment> assignments = assignmentRepository.findBySubject(subject);
        return ResponseEntity.ok(assignments);
    }

    @PreAuthorize("hasAnyRole('ORGADMIN', 'TEACHER', 'STUDENT')")
    @GetMapping("/upcoming")
    public ResponseEntity<List<Assignment>> getUpcomingAssignments() {
        List<Assignment> assignments = assignmentRepository.findUpcomingAssignments(LocalDate.now());
        return ResponseEntity.ok(assignments);
    }

    @PreAuthorize("hasAnyRole('ORGADMIN', 'TEACHER')")
    @PostMapping
    public ResponseEntity<Assignment> createAssignment(@Valid @RequestBody Assignment assignment) {
        Assignment savedAssignment = assignmentRepository.save(assignment);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedAssignment);
    }

    @PreAuthorize("hasAnyRole('ORGADMIN', 'TEACHER')")
    @PutMapping("/{id}")
    public ResponseEntity<Assignment> updateAssignment(@PathVariable Long id, @Valid @RequestBody Assignment assignment) {
        if (assignmentRepository.existsById(id)) {
            assignment.setId(id);
            Assignment updatedAssignment = assignmentRepository.save(assignment);
            return ResponseEntity.ok(updatedAssignment);
        }
        return ResponseEntity.notFound().build();
    }

    @PreAuthorize("hasRole('ORGADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAssignment(@PathVariable Long id) {
        if (assignmentRepository.existsById(id)) {
            assignmentRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
```

---

### Fix 2: Externalize Secrets

#### Step 2.1: Create .env file (NEVER commit this!)

```bash
# Create .env in backend directory
cd backend
cat > .env << 'EOF'
# JWT Configuration
JWT_SECRET=$(openssl rand -base64 64 | tr -d '\n')
JWT_EXPIRATION=3600000

# Database Configuration
DB_URL=jdbc:mysql://localhost:3306/nxtClass108
DB_USERNAME=nxtclass_user
DB_PASSWORD=$(openssl rand -base64 32 | tr -d '\n')

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:8081
EOF
```

#### Step 2.2: Update .gitignore

```bash
# Add to .gitignore
echo "backend/.env" >> .gitignore
echo ".env" >> .gitignore
echo "*.env" >> .gitignore
```

#### Step 2.3: Update application.properties

Replace the existing values with environment variables:

```properties
# Server Configuration
server.port=8080

# Spring Application Name
spring.application.name=nxt-class-backend

# Database Configuration
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.show-sql=${JPA_SHOW_SQL:false}
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# JPA/Hibernate Configuration
spring.jpa.properties.hibernate.format_sql=true

# DevTools Configuration (development only)
spring.devtools.restart.enabled=${DEVTOOLS_ENABLED:false}
spring.devtools.livereload.enabled=${DEVTOOLS_LIVERELOAD:false}

# JWT Configuration
jwt.secret=${JWT_SECRET}
jwt.expiration=${JWT_EXPIRATION:3600000}

# Logging Configuration
logging.level.com.nxtclass=${LOG_LEVEL:INFO}
logging.level.org.springframework.security=${SECURITY_LOG_LEVEL:WARN}
logging.level.org.hibernate.SQL=${HIBERNATE_LOG_LEVEL:WARN}
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=WARN

# Management Endpoints Configuration
management.endpoints.web.exposure.include=health,info
management.endpoint.health.show-details=when-authorized

# Additional Security Headers
server.servlet.session.cookie.secure=true
server.servlet.session.cookie.http-only=true

# Enable CORS
cors.allowed.origins=${CORS_ALLOWED_ORIGINS:http://localhost:5173}
```

#### Step 2.4: Create application-dev.properties

```properties
# Development-specific configuration
spring.jpa.show-sql=true
logging.level.com.nxtclass=DEBUG
logging.level.org.springframework.security=DEBUG
spring.devtools.restart.enabled=true
spring.devtools.livereload.enabled=true

# Dev CORS
cors.allowed.origins=http://localhost:5173,http://localhost:8081,http://127.0.0.1:5173
```

#### Step 2.5: Create application-prod.properties

```properties
# Production-specific configuration
spring.jpa.show-sql=false
logging.level.com.nxtclass=INFO
logging.level.org.springframework.security=WARN
spring.devtools.restart.enabled=false
spring.devtools.livereload.enabled=false

# Production CORS
cors.allowed.origins=${CORS_ALLOWED_ORIGINS}

# Force HTTPS
server.ssl.enabled=${SSL_ENABLED:false}
```

#### Step 2.6: Load .env in Development

**Option A: Using Spring Boot DevTools**

Add to `pom.xml`:
```xml
<dependency>
    <groupId>me.paulschwarz</groupId>
    <artifactId>spring-dotenv</artifactId>
    <version>4.0.0</version>
</dependency>
```

**Option B: Using IDE Configuration**

In IntelliJ IDEA / VS Code, add environment variables to run configuration.

**Option C: Docker Compose (Recommended for production)**

```yaml
# docker-compose.yml
services:
  backend:
    image: nxtclass-backend
    env_file:
      - .env
    environment:
      - SPRING_PROFILES_ACTIVE=prod
```

---

### Fix 3: Frontend Role-Based Routing

#### Step 3.1: Create RoleBasedRoute.tsx

```typescript
// src/components/RoleBasedRoute.tsx
import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { UserRole } from '@/types';

type RoleBasedRouteProps = {
  children: ReactNode;
  allowedRoles: UserRole[];
};

export default function RoleBasedRoute({ children, allowedRoles }: RoleBasedRouteProps) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
      }
    } catch (error) {
      console.error('Failed to parse user data:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
}
```

#### Step 3.2: Create useAuth Hook

```typescript
// src/hooks/useAuth.ts
import { User, UserRole } from '@/types';

export function useAuth() {
  const getUserFromStorage = (): User | null => {
    if (typeof window === 'undefined') return null;
    
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  };

  const user = getUserFromStorage();
  const isAuthenticated = !!localStorage.getItem('token');

  const hasRole = (roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const canAccess = (resource: string, action: 'read' | 'write' | 'delete'): boolean => {
    if (!user) return false;

    const permissions: Record<UserRole, string[]> = {
      orgadmin: ['*'],
      teacher: [
        'course:read', 'course:write',
        'student:read',
        'teacher:read',
        'announcement:read', 'announcement:write',
        'assignment:read', 'assignment:write'
      ],
      student: [
        'course:read',
        'announcement:read',
        'assignment:read',
        'notebook:read', 'notebook:write'
      ]
    };

    const userPermissions = permissions[user.role] || [];
    return userPermissions.includes('*') || userPermissions.includes(`${resource}:${action}`);
  };

  return { user, isAuthenticated, hasRole, canAccess };
}
```

#### Step 3.3: Update App.tsx with Role-Based Routes

```typescript
import RoleBasedRoute from "./components/RoleBasedRoute";

// ... existing imports

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          {/* ADMIN ONLY ROUTES */}
          <Route
            path="/users"
            element={
              <RoleBasedRoute allowedRoles={['orgadmin']}>
                <UserManagement />
              </RoleBasedRoute>
            }
          />
          
          {/* ADMIN & TEACHER ROUTES */}
          <Route
            path="/students"
            element={
              <RoleBasedRoute allowedRoles={['orgadmin', 'teacher']}>
                <Students />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/students/add"
            element={
              <RoleBasedRoute allowedRoles={['orgadmin']}>
                <StudentForm />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/students/edit/:id"
            element={
              <RoleBasedRoute allowedRoles={['orgadmin']}>
                <StudentForm />
              </RoleBasedRoute>
            }
          />
          
          <Route
            path="/teachers"
            element={
              <RoleBasedRoute allowedRoles={['orgadmin', 'teacher']}>
                <Teachers />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/teachers/add"
            element={
              <RoleBasedRoute allowedRoles={['orgadmin']}>
                <TeacherForm />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/teachers/edit/:id"
            element={
              <RoleBasedRoute allowedRoles={['orgadmin']}>
                <TeacherForm />
              </RoleBasedRoute>
            }
          />
          
          {/* ALL AUTHENTICATED USERS */}
          <Route
            path="/classroom"
            element={
              <ProtectedRoute>
                <VirtualClassroom />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assignments"
            element={
              <ProtectedRoute>
                <Assignments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/announcements"
            element={
              <ProtectedRoute>
                <Announcements />
              </ProtectedRoute>
            }
          />
          
          {/* ... rest of routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
```

---

### Fix 4: Add Input Validation

#### Step 4.1: Update DTOs with Validation

Example for AuthRequest:

```java
package com.nxtclass.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AuthRequest(
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    String email,
    
    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 128, message = "Password must be between 8 and 128 characters")
    String password
) {}
```

#### Step 4.2: Ensure Controllers Use @Valid

All controller methods should use `@Valid`:

```java
@PostMapping("/login")
public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request) {
    // ... implementation
}
```

---

### Fix 5: Secure Actuator Endpoints

Already done in SecurityConfig Step 1.1 above.

---

## 🧪 Testing the Security Fixes

### Test 1: RBAC Testing

```bash
# Login as student
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@nxtclass.com","password":"Admin@123"}'

# Save the token
TOKEN="<student-token>"

# Try to delete a course (should fail with 403)
curl -X DELETE http://localhost:8080/api/course/1 \
  -H "Authorization: Bearer $TOKEN"

# Expected: 403 Forbidden
```

### Test 2: Input Validation

```bash
# Try login with invalid email
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid-email","password":"Admin@123"}'

# Expected: 400 Bad Request with validation error
```

### Test 3: Actuator Access

```bash
# Try accessing actuator without auth
curl http://localhost:8080/actuator/env

# Expected: 401 Unauthorized

# Try with student token
curl http://localhost:8080/actuator/env \
  -H "Authorization: Bearer $TOKEN"

# Expected: 403 Forbidden

# Try with admin token
curl http://localhost:8080/actuator/env \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Expected: 200 OK
```

---

## 📋 Deployment Checklist

Before deploying to production:

- [ ] All secrets moved to environment variables
- [ ] `.env` file added to `.gitignore`
- [ ] `JWT_SECRET` generated with `openssl rand -base64 64`
- [ ] Database credentials updated and secured
- [ ] All controllers have `@PreAuthorize` annotations
- [ ] All DTOs have validation annotations
- [ ] Actuator endpoints secured
- [ ] CORS configured for production domains
- [ ] Logging levels set to INFO/WARN for production
- [ ] Security headers enabled
- [ ] HTTPS configured (if production)
- [ ] Database backups configured
- [ ] Monitoring and alerting setup

---

## 🆘 Rollback Plan

If issues occur after deployment:

1. **Revert code changes:**
   ```bash
   git revert <commit-hash>
   git push
   ```

2. **Restore database backup** (if needed)

3. **Check logs:**
   ```bash
   # Backend logs
   tail -f logs/application.log
   
   # Docker logs
   docker logs nxtclass-backend
   ```

4. **Emergency hotfix:**
   - Temporarily disable RBAC by commenting out `@PreAuthorize` annotations
   - Deploy hotfix
   - Investigate and fix properly

---

## 📞 Need Help?

If you encounter issues:

1. Check logs for specific errors
2. Verify environment variables are loaded
3. Test each endpoint individually
4. Review the Security Analysis Report for detailed explanations

---

**Last Updated:** 2025-10-30  
**Version:** 1.0  
**Status:** Ready for Implementation
