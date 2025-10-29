package com.nxtclass.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nxtclass.dto.CourseDTO;
import com.nxtclass.dto.SectionDTO;
import com.nxtclass.entity.Course;
import com.nxtclass.entity.Section;
import com.nxtclass.repository.CourseRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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

            // sync sections: update existing, add new, remove missing (orphanRemoval=true handles deletes)
            if (dto.getSections() != null) {
                // build new list based on DTOs
                List<Section> newList = new ArrayList<>();
                for (SectionDTO scDto : dto.getSections()) {
                    Section sc = null;
                    if (scDto.getIdentifier() != null && entity.getSections() != null) {
                        sc = entity.getSections().stream()
                                .filter(s -> s.getIdentifier() != null && s.getIdentifier().equals(scDto.getIdentifier()))
                                .findFirst()
                                .orElse(null);
                    }
                    if (sc == null) sc = new Section();
                    sc.setName(scDto.getName());
                    sc.setCourse(entity);
                    newList.add(sc);
                }
                // replace sections on entity
                entity.getSections().clear();
                entity.getSections().addAll(newList);
        }

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
