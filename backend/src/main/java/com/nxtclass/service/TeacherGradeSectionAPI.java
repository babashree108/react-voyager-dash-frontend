package com.nxtclass.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nxtclass.dto.TeacherGradeSectionDTO;
import com.nxtclass.entity.TeacherGradeSection;
import com.nxtclass.repository.TeacherGradeSectionRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeacherGradeSectionAPI {

    private final TeacherGradeSectionRepo repo;
    private final ObjectMapper objectMapper;

    public List<TeacherGradeSectionDTO> listByTeacher(Long teacherIdentifier) {
        List<TeacherGradeSection> entities = repo.findByTeacherIdentifier(teacherIdentifier);
        return entities.stream()
                .map(e -> objectMapper.convertValue(e, TeacherGradeSectionDTO.class))
                .collect(Collectors.toList());
    }

    /**
     * Replace assignments for a teacher with provided list. If list is empty, all assignments are removed.
     */
    public void saveForTeacher(Long teacherIdentifier, List<TeacherGradeSectionDTO> dtos) {
        // delete existing assignments for teacher
        repo.deleteByTeacherIdentifier(teacherIdentifier);

        if (dtos == null || dtos.isEmpty()) return;

        List<TeacherGradeSection> toSave = dtos.stream().map(dto -> {
            TeacherGradeSection e = new TeacherGradeSection();
            e.setTeacherIdentifier(teacherIdentifier);
            e.setGradeIdentifier(dto.getGradeIdentifier());
            e.setSectionIdentifier(dto.getSectionIdentifier()); // may be null
            return e;
        }).collect(Collectors.toList());

        repo.saveAll(toSave);
    }
}
