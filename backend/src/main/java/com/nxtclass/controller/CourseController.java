package com.nxtclass.controller;

import com.nxtclass.dto.CourseDTO;
import com.nxtclass.service.CourseAPI;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/course")
public class CourseController {
    private final CourseAPI courseAPI;

    public CourseController(CourseAPI courseAPI) {
        this.courseAPI = courseAPI;
    }

    @GetMapping("list")
    public ResponseEntity<List<CourseDTO>> list() {
        List<CourseDTO> course = courseAPI.list();
        return ResponseEntity.ok(course);
    }
    @GetMapping("count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok( courseAPI.list().stream().count());
    }


    @PostMapping("save")
    public ResponseEntity<Long> save (@RequestBody CourseDTO dto){
        return ResponseEntity.ok(courseAPI.save(dto));
    }

    @PutMapping("update")
    public ResponseEntity<?> update(@RequestBody CourseDTO dto) {
        return (dto.getIdentifier() == null)
                ? ResponseEntity.badRequest().body("Identifier is required for update.")
                : ResponseEntity.ok(courseAPI.save(dto));
    }

    @GetMapping("/{identifier}")
    public ResponseEntity<?> getDetails(@PathVariable Long identifier) {
        try {
            CourseDTO dto = courseAPI.details(identifier);
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

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
