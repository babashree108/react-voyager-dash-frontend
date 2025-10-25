# Spring Boot Backend Implementation Guide

This document provides the complete Spring Boot backend implementation for the Virtual Classroom system.

## Project Structure

```
src/main/java/com/yourcompany/virtualclassroom/
├── config/
│   ├── WebSocketConfig.java
│   └── CorsConfig.java
├── model/
│   ├── User.java
│   ├── ClassroomSession.java
│   ├── StreamParticipant.java
│   ├── NotebookPage.java
│   ├── DigitalNotebook.java
│   ├── HandRaiseEvent.java
│   ├── WindowViolation.java
│   └── StudentMonitoring.java
├── dto/
│   ├── ClassroomMessageDTO.java
│   ├── WebRTCSignalDTO.java
│   ├── BroadcastControlDTO.java
│   └── NotebookUpdateDTO.java
├── controller/
│   ├── ClassroomController.java
│   ├── NotebookController.java
│   └── WebSocketController.java
├── service/
│   ├── ClassroomService.java
│   ├── NotebookService.java
│   ├── MonitoringService.java
│   └── WebRTCSignalingService.java
└── repository/
    ├── UserRepository.java
    ├── ClassroomSessionRepository.java
    ├── NotebookPageRepository.java
    └── WindowViolationRepository.java
```

## Dependencies (pom.xml)

Add these dependencies to your `pom.xml`:

```xml
<dependencies>
    <!-- Spring Boot Starter Web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- Spring Boot Starter WebSocket -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-websocket</artifactId>
    </dependency>

    <!-- Spring Boot Starter Data JPA -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>

    <!-- PostgreSQL/MySQL Driver (choose one) -->
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
        <scope>runtime</scope>
    </dependency>

    <!-- Lombok -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>

    <!-- Jackson for JSON -->
    <dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-databind</artifactId>
    </dependency>

    <!-- Spring Boot Starter Validation -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
</dependencies>
```

## Configuration Files

### 1. WebSocket Configuration

```java
package com.yourcompany.virtualclassroom.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue");
        config.setApplicationDestinationPrefixes("/app");
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }
}
```

### 2. CORS Configuration

```java
package com.yourcompany.virtualclassroom.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOriginPattern("*");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
```

## Entity Classes

### 1. User.java

```java
package com.yourcompany.virtualclassroom.model;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    @Column(nullable = false)
    private String status = "active";

    private String organization;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum UserRole {
        ORGADMIN, TEACHER, STUDENT
    }
}
```

### 2. ClassroomSession.java

```java
package com.yourcompany.virtualclassroom.model;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "classroom_sessions")
public class ClassroomSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String subject;

    @Column(name = "teacher_id", nullable = false)
    private Long teacherId;

    @Column(name = "teacher_name")
    private String teacherName;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SessionStatus status = SessionStatus.SCHEDULED;

    @Column(name = "is_recording")
    private Boolean isRecording = false;

    @Column(name = "is_broadcast_active")
    private Boolean isBroadcastActive = false;

    @Column(name = "broadcasting_student_id")
    private Long broadcastingStudentId;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL)
    private List<StreamParticipant> participants = new ArrayList<>();

    public enum SessionStatus {
        SCHEDULED, ACTIVE, ENDED
    }
}
```

### 3. StreamParticipant.java

```java
package com.yourcompany.virtualclassroom.model;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "stream_participants")
public class StreamParticipant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "session_id", nullable = false)
    private ClassroomSession session;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ParticipantRole role;

    @Column(name = "is_muted")
    private Boolean isMuted = false;

    @Column(name = "is_video_off")
    private Boolean isVideoOff = false;

    @Column(name = "is_speaking")
    private Boolean isSpeaking = false;

    @Column(name = "is_hand_raised")
    private Boolean isHandRaised = false;

    @Column(name = "is_broadcasting")
    private Boolean isBroadcasting = false;

    @Column(name = "is_fullscreen_active")
    private Boolean isFullscreenActive = false;

    @Column(name = "is_window_focused")
    private Boolean isWindowFocused = true;

    @Column(name = "joined_at")
    private LocalDateTime joinedAt = LocalDateTime.now();

    @Column(name = "left_at")
    private LocalDateTime leftAt;

    public enum ParticipantRole {
        TEACHER, STUDENT
    }
}
```

### 4. NotebookPage.java

```java
package com.yourcompany.virtualclassroom.model;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "notebook_pages")
public class NotebookPage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "session_id", nullable = false)
    private Long sessionId;

    @Column(name = "page_number", nullable = false)
    private Integer pageNumber;

    @Lob
    @Column(name = "canvas_data", columnDefinition = "TEXT")
    private String canvasData;

    @Column(nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();
}
```

### 5. WindowViolation.java

```java
package com.yourcompany.virtualclassroom.model;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "window_violations")
public class WindowViolation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "session_id", nullable = false)
    private Long sessionId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ViolationType type;

    @Column(nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();

    private Long duration;

    public enum ViolationType {
        FULLSCREEN_EXIT, WINDOW_BLUR, TAB_SWITCH
    }
}
```

## DTO Classes

### 1. ClassroomMessageDTO.java

```java
package com.yourcompany.virtualclassroom.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ClassroomMessageDTO {
    private String type;
    private Object payload;
    private String from;
    private LocalDateTime timestamp;
}
```

### 2. WebRTCSignalDTO.java

```java
package com.yourcompany.virtualclassroom.dto;

import lombok.Data;

@Data
public class WebRTCSignalDTO {
    private String from;
    private String to;
    private Object signal;
    private String type; // "offer", "answer", "ice-candidate"
}
```

### 3. BroadcastControlDTO.java

```java
package com.yourcompany.virtualclassroom.dto;

import lombok.Data;

@Data
public class BroadcastControlDTO {
    private Long teacherId;
    private Long studentId;
    private String action; // "start" or "stop"
    private Boolean includeAudio;
    private Boolean includeVideo;
}
```

### 4. StudentMonitoringDTO.java

```java
package com.yourcompany.virtualclassroom.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class StudentMonitoringDTO {
    private Long studentId;
    private Boolean isFullscreenActive;
    private Boolean isWindowFocused;
    private LocalDateTime lastActivityTime;
    private List<ViolationDTO> violations;

    @Data
    public static class ViolationDTO {
        private Long id;
        private String type;
        private LocalDateTime timestamp;
        private Long duration;
    }
}
```

## Service Classes

### 1. ClassroomService.java

```java
package com.yourcompany.virtualclassroom.service;

import com.yourcompany.virtualclassroom.model.*;
import com.yourcompany.virtualclassroom.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ClassroomService {

    private final ClassroomSessionRepository sessionRepository;
    private final StreamParticipantRepository participantRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public ClassroomSession createSession(ClassroomSession session) {
        session.setStatus(ClassroomSession.SessionStatus.SCHEDULED);
        return sessionRepository.save(session);
    }

    @Transactional
    public ClassroomSession startSession(Long sessionId) {
        ClassroomSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        session.setStatus(ClassroomSession.SessionStatus.ACTIVE);
        session.setStartTime(LocalDateTime.now());
        return sessionRepository.save(session);
    }

    @Transactional
    public ClassroomSession endSession(Long sessionId) {
        ClassroomSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        session.setStatus(ClassroomSession.SessionStatus.ENDED);
        session.setEndTime(LocalDateTime.now());
        return sessionRepository.save(session);
    }

    @Transactional
    public StreamParticipant joinSession(Long sessionId, Long userId, String name, 
                                          StreamParticipant.ParticipantRole role) {
        ClassroomSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        StreamParticipant participant = new StreamParticipant();
        participant.setSession(session);
        participant.setUserId(userId);
        participant.setName(name);
        participant.setRole(role);
        participant.setJoinedAt(LocalDateTime.now());

        participant = participantRepository.save(participant);

        // Notify all participants
        messagingTemplate.convertAndSend(
                "/topic/session/" + sessionId + "/participant-joined",
                participant
        );

        return participant;
    }

    @Transactional
    public void leaveSession(Long sessionId, Long userId) {
        Optional<StreamParticipant> participant = participantRepository
                .findBySessionIdAndUserId(sessionId, userId);

        if (participant.isPresent()) {
            StreamParticipant p = participant.get();
            p.setLeftAt(LocalDateTime.now());
            participantRepository.save(p);

            // Notify all participants
            messagingTemplate.convertAndSend(
                    "/topic/session/" + sessionId + "/participant-left",
                    p
            );
        }
    }

    @Transactional
    public void updateParticipantMonitoring(Long sessionId, Long userId, 
                                             Boolean isFullscreen, Boolean isFocused) {
        Optional<StreamParticipant> participant = participantRepository
                .findBySessionIdAndUserId(sessionId, userId);

        if (participant.isPresent()) {
            StreamParticipant p = participant.get();
            p.setIsFullscreenActive(isFullscreen);
            p.setIsWindowFocused(isFocused);
            participantRepository.save(p);

            // Notify teacher
            messagingTemplate.convertAndSend(
                    "/topic/session/" + sessionId + "/monitoring-update",
                    p
            );
        }
    }

    @Transactional
    public void raiseHand(Long sessionId, Long userId, Boolean isRaised) {
        Optional<StreamParticipant> participant = participantRepository
                .findBySessionIdAndUserId(sessionId, userId);

        if (participant.isPresent()) {
            StreamParticipant p = participant.get();
            p.setIsHandRaised(isRaised);
            participantRepository.save(p);

            // Notify all participants
            messagingTemplate.convertAndSend(
                    "/topic/session/" + sessionId + "/hand-raise",
                    p
            );
        }
    }

    @Transactional
    public void muteAllStudents(Long sessionId) {
        ClassroomSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        List<StreamParticipant> students = participantRepository
                .findBySessionIdAndRole(sessionId, StreamParticipant.ParticipantRole.STUDENT);

        students.forEach(student -> {
            student.setIsMuted(true);
            participantRepository.save(student);
        });

        // Notify all students
        messagingTemplate.convertAndSend(
                "/topic/session/" + sessionId + "/mute-all-students",
                "All students muted"
        );
    }

    @Transactional
    public void setBroadcastStudent(Long sessionId, Long studentId, Boolean broadcast) {
        ClassroomSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (broadcast) {
            session.setBroadcastingStudentId(studentId);
            session.setIsBroadcastActive(true);
        } else {
            session.setBroadcastingStudentId(null);
            session.setIsBroadcastActive(false);
        }

        sessionRepository.save(session);

        // Update participant
        if (studentId != null) {
            Optional<StreamParticipant> participant = participantRepository
                    .findBySessionIdAndUserId(sessionId, studentId);
            if (participant.isPresent()) {
                StreamParticipant p = participant.get();
                p.setIsBroadcasting(broadcast);
                participantRepository.save(p);
            }
        }

        // Notify all participants
        messagingTemplate.convertAndSend(
                "/topic/session/" + sessionId + "/broadcast-control",
                session
        );
    }

    public ClassroomSession getSession(Long sessionId) {
        return sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
    }

    public List<StreamParticipant> getSessionParticipants(Long sessionId) {
        return participantRepository.findBySessionId(sessionId);
    }
}
```

### 2. NotebookService.java

```java
package com.yourcompany.virtualclassroom.service;

import com.yourcompany.virtualclassroom.model.NotebookPage;
import com.yourcompany.virtualclassroom.repository.NotebookPageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotebookService {

    private final NotebookPageRepository notebookPageRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public NotebookPage savePage(NotebookPage page) {
        page.setTimestamp(LocalDateTime.now());
        NotebookPage saved = notebookPageRepository.save(page);

        // Notify teacher about notebook update
        messagingTemplate.convertAndSend(
                "/topic/session/" + page.getSessionId() + "/notebook-update",
                saved
        );

        return saved;
    }

    public List<NotebookPage> getStudentNotebook(Long studentId, Long sessionId) {
        return notebookPageRepository.findByStudentIdAndSessionIdOrderByPageNumber(
                studentId, sessionId
        );
    }

    public NotebookPage getPage(Long studentId, Long sessionId, Integer pageNumber) {
        return notebookPageRepository.findByStudentIdAndSessionIdAndPageNumber(
                studentId, sessionId, pageNumber
        ).orElse(null);
    }

    public List<NotebookPage> getAllNotebooksForSession(Long sessionId) {
        return notebookPageRepository.findBySessionIdOrderByStudentIdAscPageNumberAsc(sessionId);
    }

    @Transactional
    public void deleteNotebook(Long studentId, Long sessionId) {
        notebookPageRepository.deleteByStudentIdAndSessionId(studentId, sessionId);
    }
}
```

### 3. MonitoringService.java

```java
package com.yourcompany.virtualclassroom.service;

import com.yourcompany.virtualclassroom.model.WindowViolation;
import com.yourcompany.virtualclassroom.repository.WindowViolationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MonitoringService {

    private final WindowViolationRepository violationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public WindowViolation recordViolation(Long studentId, Long sessionId, 
                                            WindowViolation.ViolationType type) {
        WindowViolation violation = new WindowViolation();
        violation.setStudentId(studentId);
        violation.setSessionId(sessionId);
        violation.setType(type);
        violation.setTimestamp(LocalDateTime.now());

        WindowViolation saved = violationRepository.save(violation);

        // Notify teacher
        messagingTemplate.convertAndSend(
                "/topic/session/" + sessionId + "/violation",
                saved
        );

        return saved;
    }

    public List<WindowViolation> getStudentViolations(Long studentId, Long sessionId) {
        return violationRepository.findByStudentIdAndSessionIdOrderByTimestampDesc(
                studentId, sessionId
        );
    }

    public List<WindowViolation> getSessionViolations(Long sessionId) {
        return violationRepository.findBySessionIdOrderByTimestampDesc(sessionId);
    }

    public Long getViolationCount(Long studentId, Long sessionId) {
        return violationRepository.countByStudentIdAndSessionId(studentId, sessionId);
    }
}
```

## Controller Classes

### 1. ClassroomController.java

```java
package com.yourcompany.virtualclassroom.controller;

import com.yourcompany.virtualclassroom.dto.BroadcastControlDTO;
import com.yourcompany.virtualclassroom.model.ClassroomSession;
import com.yourcompany.virtualclassroom.model.StreamParticipant;
import com.yourcompany.virtualclassroom.service.ClassroomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/classroom")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ClassroomController {

    private final ClassroomService classroomService;

    @PostMapping("/sessions")
    public ResponseEntity<ClassroomSession> createSession(@RequestBody ClassroomSession session) {
        return ResponseEntity.ok(classroomService.createSession(session));
    }

    @GetMapping("/sessions/{sessionId}")
    public ResponseEntity<ClassroomSession> getSession(@PathVariable Long sessionId) {
        return ResponseEntity.ok(classroomService.getSession(sessionId));
    }

    @PostMapping("/sessions/{sessionId}/start")
    public ResponseEntity<ClassroomSession> startSession(@PathVariable Long sessionId) {
        return ResponseEntity.ok(classroomService.startSession(sessionId));
    }

    @PostMapping("/sessions/{sessionId}/end")
    public ResponseEntity<ClassroomSession> endSession(@PathVariable Long sessionId) {
        return ResponseEntity.ok(classroomService.endSession(sessionId));
    }

    @PostMapping("/sessions/{sessionId}/join")
    public ResponseEntity<StreamParticipant> joinSession(
            @PathVariable Long sessionId,
            @RequestBody Map<String, Object> request) {
        Long userId = Long.valueOf(request.get("userId").toString());
        String name = request.get("name").toString();
        StreamParticipant.ParticipantRole role = StreamParticipant.ParticipantRole
                .valueOf(request.get("role").toString().toUpperCase());

        return ResponseEntity.ok(classroomService.joinSession(sessionId, userId, name, role));
    }

    @PostMapping("/sessions/{sessionId}/leave")
    public ResponseEntity<Void> leaveSession(
            @PathVariable Long sessionId,
            @RequestBody Map<String, Long> request) {
        classroomService.leaveSession(sessionId, request.get("userId"));
        return ResponseEntity.ok().build();
    }

    @GetMapping("/sessions/{sessionId}/participants")
    public ResponseEntity<List<StreamParticipant>> getParticipants(@PathVariable Long sessionId) {
        return ResponseEntity.ok(classroomService.getSessionParticipants(sessionId));
    }

    @PostMapping("/sessions/{sessionId}/hand-raise")
    public ResponseEntity<Void> raiseHand(
            @PathVariable Long sessionId,
            @RequestBody Map<String, Object> request) {
        Long userId = Long.valueOf(request.get("userId").toString());
        Boolean isRaised = (Boolean) request.get("isRaised");
        classroomService.raiseHand(sessionId, userId, isRaised);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/sessions/{sessionId}/mute-all")
    public ResponseEntity<Void> muteAllStudents(@PathVariable Long sessionId) {
        classroomService.muteAllStudents(sessionId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/sessions/{sessionId}/broadcast")
    public ResponseEntity<Void> controlBroadcast(
            @PathVariable Long sessionId,
            @RequestBody BroadcastControlDTO control) {
        boolean broadcast = "start".equals(control.getAction());
        classroomService.setBroadcastStudent(sessionId, control.getStudentId(), broadcast);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/sessions/{sessionId}/monitoring")
    public ResponseEntity<Void> updateMonitoring(
            @PathVariable Long sessionId,
            @RequestBody Map<String, Object> request) {
        Long userId = Long.valueOf(request.get("userId").toString());
        Boolean isFullscreen = (Boolean) request.get("isFullscreenActive");
        Boolean isFocused = (Boolean) request.get("isWindowFocused");
        classroomService.updateParticipantMonitoring(sessionId, userId, isFullscreen, isFocused);
        return ResponseEntity.ok().build();
    }
}
```

### 2. NotebookController.java

```java
package com.yourcompany.virtualclassroom.controller;

import com.yourcompany.virtualclassroom.model.NotebookPage;
import com.yourcompany.virtualclassroom.service.NotebookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notebook")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NotebookController {

    private final NotebookService notebookService;

    @PostMapping("/pages")
    public ResponseEntity<NotebookPage> savePage(@RequestBody NotebookPage page) {
        return ResponseEntity.ok(notebookService.savePage(page));
    }

    @GetMapping("/student/{studentId}/session/{sessionId}")
    public ResponseEntity<List<NotebookPage>> getStudentNotebook(
            @PathVariable Long studentId,
            @PathVariable Long sessionId) {
        return ResponseEntity.ok(notebookService.getStudentNotebook(studentId, sessionId));
    }

    @GetMapping("/student/{studentId}/session/{sessionId}/page/{pageNumber}")
    public ResponseEntity<NotebookPage> getPage(
            @PathVariable Long studentId,
            @PathVariable Long sessionId,
            @PathVariable Integer pageNumber) {
        NotebookPage page = notebookService.getPage(studentId, sessionId, pageNumber);
        return page != null ? ResponseEntity.ok(page) : ResponseEntity.notFound().build();
    }

    @GetMapping("/session/{sessionId}/all")
    public ResponseEntity<List<NotebookPage>> getAllNotebooks(@PathVariable Long sessionId) {
        return ResponseEntity.ok(notebookService.getAllNotebooksForSession(sessionId));
    }

    @DeleteMapping("/student/{studentId}/session/{sessionId}")
    public ResponseEntity<Void> deleteNotebook(
            @PathVariable Long studentId,
            @PathVariable Long sessionId) {
        notebookService.deleteNotebook(studentId, sessionId);
        return ResponseEntity.ok().build();
    }
}
```

### 3. WebSocketController.java

```java
package com.yourcompany.virtualclassroom.controller;

import com.yourcompany.virtualclassroom.dto.*;
import com.yourcompany.virtualclassroom.service.ClassroomService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class WebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ClassroomService classroomService;

    @MessageMapping("/classroom/{sessionId}/message")
    @SendTo("/topic/session/{sessionId}/messages")
    public ClassroomMessageDTO handleMessage(
            @DestinationVariable Long sessionId,
            @Payload ClassroomMessageDTO message) {
        return message;
    }

    @MessageMapping("/classroom/{sessionId}/signal")
    public void handleWebRTCSignal(
            @DestinationVariable Long sessionId,
            @Payload WebRTCSignalDTO signal) {
        // Send signal to specific participant
        messagingTemplate.convertAndSendToUser(
                signal.getTo(),
                "/queue/signal",
                signal
        );
    }

    @MessageMapping("/classroom/{sessionId}/monitoring")
    @SendTo("/topic/session/{sessionId}/monitoring")
    public StudentMonitoringDTO handleMonitoring(
            @DestinationVariable Long sessionId,
            @Payload StudentMonitoringDTO monitoring) {
        return monitoring;
    }
}
```

## Repository Interfaces

```java
package com.yourcompany.virtualclassroom.repository;

import com.yourcompany.virtualclassroom.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ClassroomSessionRepository extends JpaRepository<ClassroomSession, Long> {
    List<ClassroomSession> findByTeacherId(Long teacherId);
    List<ClassroomSession> findByStatus(ClassroomSession.SessionStatus status);
}

@Repository
public interface StreamParticipantRepository extends JpaRepository<StreamParticipant, Long> {
    List<StreamParticipant> findBySessionId(Long sessionId);
    Optional<StreamParticipant> findBySessionIdAndUserId(Long sessionId, Long userId);
    List<StreamParticipant> findBySessionIdAndRole(Long sessionId, StreamParticipant.ParticipantRole role);
}

@Repository
public interface NotebookPageRepository extends JpaRepository<NotebookPage, Long> {
    List<NotebookPage> findByStudentIdAndSessionIdOrderByPageNumber(Long studentId, Long sessionId);
    Optional<NotebookPage> findByStudentIdAndSessionIdAndPageNumber(Long studentId, Long sessionId, Integer pageNumber);
    List<NotebookPage> findBySessionIdOrderByStudentIdAscPageNumberAsc(Long sessionId);
    void deleteByStudentIdAndSessionId(Long studentId, Long sessionId);
}

@Repository
public interface WindowViolationRepository extends JpaRepository<WindowViolation, Long> {
    List<WindowViolation> findByStudentIdAndSessionIdOrderByTimestampDesc(Long studentId, Long sessionId);
    List<WindowViolation> findBySessionIdOrderByTimestampDesc(Long sessionId);
    Long countByStudentIdAndSessionId(Long studentId, Long sessionId);
}

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
```

## Application Properties

```properties
# application.properties
server.port=8080

# Database Configuration (PostgreSQL example)
spring.datasource.url=jdbc:postgresql://localhost:5432/virtualclassroom
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# WebSocket Configuration
spring.websocket.allowed-origins=http://localhost:3000,http://localhost:5173

# File Upload (for large canvas data)
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

## Setup Instructions

1. **Create a new Spring Boot project** with the following dependencies:
   - Spring Web
   - Spring WebSocket
   - Spring Data JPA
   - PostgreSQL Driver (or your preferred database)
   - Lombok

2. **Copy all the Java files** above into your project structure

3. **Update** `application.properties` with your database credentials

4. **Run the application**:
   ```bash
   ./mvnw spring-boot:run
   ```

5. **Test WebSocket connection** at: `ws://localhost:8080/ws`

## Testing the API

### Create a Session
```bash
curl -X POST http://localhost:8080/api/classroom/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mathematics Class",
    "subject": "Math",
    "teacherId": 1,
    "teacherName": "John Doe",
    "startTime": "2025-10-21T10:00:00"
  }'
```

### Join a Session
```bash
curl -X POST http://localhost:8080/api/classroom/sessions/1/join \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 2,
    "name": "Jane Student",
    "role": "STUDENT"
  }'
```

## Notes

- This implementation uses Spring Boot's built-in WebSocket support with STOMP protocol
- For production, consider adding:
  - Authentication/Authorization (Spring Security)
  - TURN server configuration for WebRTC
  - Redis for session management
  - Database connection pooling
  - Logging and monitoring
  - Error handling and validation
  - Rate limiting
  - SSL/TLS certificates

- The frontend needs to use STOMP client (like @stomp/stompjs) to connect to WebSocket endpoints
