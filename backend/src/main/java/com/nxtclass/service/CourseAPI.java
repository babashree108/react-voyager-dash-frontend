package com.nxtclass.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nxtclass.dto.CourseDTO;
import com.nxtclass.entity.Course;
import com.nxtclass.repository.CourseRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseAPI {

    private final CourseRepo repo;

    private final ObjectMapper objectMapper;

    public List<CourseDTO> list() {
        List<Course> entities = repo.findAll();
        return entities.stream()
                .map(entity -> objectMapper.convertValue(entity, CourseDTO.class))
                .collect(Collectors.toList());
    }

    public Long save (CourseDTO dto) {
        Course entity = (dto.getIdentifier() != null)
                ? repo.findById(dto.getIdentifier()).orElse(new Course())
                : new Course();
        entity.setCourse(dto.getCourse());
    entity.setDescription(dto.getDescription());
        return repo.save(entity).getIdentifier();
    }

    public CourseDTO details (Long identifier) {
        Course entity = repo.findById(identifier)
                .orElseThrow(() -> new RuntimeException("Course not found with ID: " + identifier));
        return objectMapper.convertValue(entity, CourseDTO.class);
    }

    public String delete(Long identifier) {
        if (!repo.existsById(identifier)) {
            throw new RuntimeException("Course not found with ID: " + identifier);
        }
        repo.deleteById(identifier);
        return "success";
    }

}
