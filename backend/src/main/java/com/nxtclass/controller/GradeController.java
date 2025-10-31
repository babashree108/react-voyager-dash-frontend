package com.nxtclass.controller;

import com.nxtclass.dto.GradeDTO;
import com.nxtclass.service.GradeAPI;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grade")
public class GradeController {
    private final GradeAPI gradeAPI;

    public GradeController(GradeAPI gradeAPI) {
        this.gradeAPI = gradeAPI;
    }

    @GetMapping("list")
    public ResponseEntity<List<GradeDTO>> list() {
        List<GradeDTO> grade = gradeAPI.list();
        return ResponseEntity.ok(grade);
    }
    @GetMapping("count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok( gradeAPI.list().stream().count());
    }


    @PostMapping("save")
    public ResponseEntity<Long> save (@RequestBody GradeDTO dto){
        return ResponseEntity.ok(gradeAPI.save(dto));
    }

    @PutMapping("update")
    public ResponseEntity<?> update(@RequestBody GradeDTO dto) {
        return (dto.getIdentifier() == null)
                ? ResponseEntity.badRequest().body("Identifier is required for update.")
                : ResponseEntity.ok(gradeAPI.save(dto));
    }

    @GetMapping("/{identifier}")
    public ResponseEntity<?> getDetails(@PathVariable Long identifier) {
        try {
            GradeDTO dto = gradeAPI.details(identifier);
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{identifier}")
    public ResponseEntity<String> delete(@PathVariable Long identifier) {
        try {
            String result = gradeAPI.delete(identifier);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }


}
