package com.nxtclass.controller;

import com.nxtclass.dto.TeacherDetailsDTO;
import com.nxtclass.service.TeacherDetailsAPI;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/teacher-details")
public class TeacherDetailsController {
    private final TeacherDetailsAPI teacherDetailsAPI;

    @GetMapping("list")
    public ResponseEntity<List<TeacherDetailsDTO>> list() {
        List<TeacherDetailsDTO> teachers = teacherDetailsAPI.list();
        return ResponseEntity.ok(teachers);
    }

    @GetMapping("count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(teacherDetailsAPI.list().stream().count());
    }

    @PostMapping("save")
    public ResponseEntity<Long> save(@RequestBody TeacherDetailsDTO dto) {
        return ResponseEntity.ok(teacherDetailsAPI.save(dto));
    }

    @PutMapping("update")
    public ResponseEntity<?> update(@RequestBody TeacherDetailsDTO dto) {
        return (dto.getIdentifier() == null)
                ? ResponseEntity.badRequest().body("Identifier is required for update.")
                : ResponseEntity.ok(teacherDetailsAPI.save(dto));
    }

    @GetMapping("/{identifier}")
    public ResponseEntity<?> getDetails(@PathVariable Long identifier) {
        try {
            TeacherDetailsDTO dto = teacherDetailsAPI.details(identifier);
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

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