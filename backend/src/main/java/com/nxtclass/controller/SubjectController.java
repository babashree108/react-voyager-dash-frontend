package com.nxtclass.controller;

import com.nxtclass.dto.SubjectDTO;
import com.nxtclass.service.SubjectAPI;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/subject-details")
public class SubjectController {
    
    private final SubjectAPI subjectAPI;

    @GetMapping("list")
    public ResponseEntity<List<SubjectDTO>> list() {
        List<SubjectDTO> subjects = subjectAPI.list();
        return ResponseEntity.ok(subjects);
    }

    @GetMapping("count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(subjectAPI.list().stream().count());
    }

    @PostMapping("save")
    public ResponseEntity<String> save(@RequestBody List<SubjectDTO> dto) {
        subjectAPI.save(dto);
        return ResponseEntity.ok("Success");
    }


    @PutMapping("update")
    public ResponseEntity<?> update(@RequestBody SubjectDTO dto) {
        if (dto.getIdentifier() == null) {
            return ResponseEntity.badRequest().body("Identifier is required for update.");
        }
        subjectAPI.update(dto);
        return ResponseEntity.ok("Success");
    }

    @GetMapping("/{identifier}")
    public ResponseEntity<?> details(@PathVariable Long identifier) {
        try {
            SubjectDTO dto = subjectAPI.details(identifier);
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{identifier}")
    public ResponseEntity<String> delete(@PathVariable Long identifier) {
        try {
            String result = subjectAPI.delete(identifier);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}