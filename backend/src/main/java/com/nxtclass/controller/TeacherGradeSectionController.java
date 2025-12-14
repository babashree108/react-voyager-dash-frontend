package com.nxtclass.controller;

import com.nxtclass.dto.TeacherGradeSectionDTO;
import com.nxtclass.dto.TeacherDetailsDTO;
import com.nxtclass.service.TeacherDetailsAPI;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller delegating teacher assignment operations to TeacherDetailsAPI.
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/teacher-details")
public class TeacherGradeSectionController {

    private final TeacherDetailsAPI teacherDetailsAPI;

    @GetMapping("/{teacherId}/assignments")
    public ResponseEntity<List<TeacherGradeSectionDTO>> getAssignments(@PathVariable Long teacherId) {
        TeacherDetailsDTO dto = teacherDetailsAPI.details(teacherId);
        return ResponseEntity.ok(dto.getTeacherGradeLinking());
    }

    @PostMapping("/{teacherId}/assignments")
    public ResponseEntity<String> saveAssignments(@PathVariable Long teacherId,
                                                  @RequestBody List<TeacherGradeSectionDTO> dtos) {
        // load existing teacher DTO to preserve other fields, attach assignments and save
        TeacherDetailsDTO existing = teacherDetailsAPI.details(teacherId);
        existing.setTeacherGradeLinking(dtos);
        teacherDetailsAPI.save(existing);
        return ResponseEntity.ok("success");
    }
}
