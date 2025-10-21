package com.nxtclass.controller;

import com.nxtclass.entity.ClassSession;
import com.nxtclass.entity.SessionStatus;
import com.nxtclass.repository.ClassSessionRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/classes")
@CrossOrigin(origins = "http://localhost:5173")
public class ClassSessionController {
    
    @Autowired
    private ClassSessionRepository classSessionRepository;

    @GetMapping
    public ResponseEntity<List<ClassSession>> getAllClasses() {
        List<ClassSession> classes = classSessionRepository.findAll();
        return ResponseEntity.ok(classes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClassSession> getClassById(@PathVariable Long id) {
        Optional<ClassSession> classSession = classSessionRepository.findById(id);
        return classSession.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<ClassSession>> getClassesByStatus(@PathVariable SessionStatus status) {
        List<ClassSession> classes = classSessionRepository.findByStatus(status);
        return ResponseEntity.ok(classes);
    }

    @GetMapping("/teacher/{teacher}")
    public ResponseEntity<List<ClassSession>> getClassesByTeacher(@PathVariable String teacher) {
        List<ClassSession> classes = classSessionRepository.findByTeacher(teacher);
        return ResponseEntity.ok(classes);
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<ClassSession>> getUpcomingClasses() {
        List<ClassSession> classes = classSessionRepository.findUpcomingSessions(LocalDate.now());
        return ResponseEntity.ok(classes);
    }

    @PostMapping
    public ResponseEntity<ClassSession> createClass(@Valid @RequestBody ClassSession classSession) {
        ClassSession savedClass = classSessionRepository.save(classSession);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedClass);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClassSession> updateClass(@PathVariable Long id, @Valid @RequestBody ClassSession classSession) {
        if (classSessionRepository.existsById(id)) {
            classSession.setId(id);
            ClassSession updatedClass = classSessionRepository.save(classSession);
            return ResponseEntity.ok(updatedClass);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClass(@PathVariable Long id) {
        if (classSessionRepository.existsById(id)) {
            classSessionRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}