package com.nxtclass.controller;

import com.nxtclass.entity.Assignment;
import com.nxtclass.entity.AssignmentStatus;
import com.nxtclass.repository.AssignmentRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {
    
    @Autowired
    private AssignmentRepository assignmentRepository;

    @GetMapping
    public ResponseEntity<List<Assignment>> getAllAssignments() {
        List<Assignment> assignments = assignmentRepository.findAll();
        return ResponseEntity.ok(assignments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Assignment> getAssignmentById(@PathVariable Long id) {
        Optional<Assignment> assignment = assignmentRepository.findById(id);
        return assignment.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Assignment>> getAssignmentsByStatus(@PathVariable AssignmentStatus status) {
        List<Assignment> assignments = assignmentRepository.findByStatus(status);
        return ResponseEntity.ok(assignments);
    }

    @GetMapping("/subject/{subject}")
    public ResponseEntity<List<Assignment>> getAssignmentsBySubject(@PathVariable String subject) {
        List<Assignment> assignments = assignmentRepository.findBySubject(subject);
        return ResponseEntity.ok(assignments);
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<Assignment>> getUpcomingAssignments() {
        List<Assignment> assignments = assignmentRepository.findUpcomingAssignments(LocalDate.now());
        return ResponseEntity.ok(assignments);
    }

    @PostMapping
    public ResponseEntity<Assignment> createAssignment(@Valid @RequestBody Assignment assignment) {
        Assignment savedAssignment = assignmentRepository.save(assignment);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedAssignment);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Assignment> updateAssignment(@PathVariable Long id, @Valid @RequestBody Assignment assignment) {
        if (assignmentRepository.existsById(id)) {
            assignment.setId(id);
            Assignment updatedAssignment = assignmentRepository.save(assignment);
            return ResponseEntity.ok(updatedAssignment);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAssignment(@PathVariable Long id) {
        if (assignmentRepository.existsById(id)) {
            assignmentRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}