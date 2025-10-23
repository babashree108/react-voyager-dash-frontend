package com.nxtclass.controller;

import com.nxtclass.dto.StudentDetailsDTO;
import com.nxtclass.service.StudentDetailsAPI;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/student-details")
public class StudentDetailsController {
    private final StudentDetailsAPI studentDetailsAPI;

    @GetMapping("list")
    public ResponseEntity<List<StudentDetailsDTO>> list() {
        List<StudentDetailsDTO> students = studentDetailsAPI.list();
        return ResponseEntity.ok(students);
    }
    @GetMapping("count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok( studentDetailsAPI.list().stream().count());
    }


    @PostMapping("save")
    public ResponseEntity<Long> save (@RequestBody StudentDetailsDTO dto){
        return ResponseEntity.ok(studentDetailsAPI.save(dto));
    }

    @PutMapping("update")
    public ResponseEntity<?> update(@RequestBody StudentDetailsDTO dto) {
        return (dto.getIdentifier() == null)
                ? ResponseEntity.badRequest().body("Identifier is required for update.")
                : ResponseEntity.ok(studentDetailsAPI.save(dto));
    }

    @GetMapping("/{identifier}")
    public ResponseEntity<?> getDetails(@PathVariable Long identifier) {
        try {
            StudentDetailsDTO dto = studentDetailsAPI.details(identifier);
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

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