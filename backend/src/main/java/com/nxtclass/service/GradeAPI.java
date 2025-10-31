package com.nxtclass.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nxtclass.dto.GradeDTO;
import com.nxtclass.dto.SectionDTO;
import com.nxtclass.entity.Grade;
import com.nxtclass.entity.Section;
import com.nxtclass.repository.GradeRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GradeAPI {

    private final GradeRepo repo;

    private final ObjectMapper objectMapper;

    public List<GradeDTO> list() {
        List<Grade> entities = repo.findAll();
        return entities.stream()
                .map(entity -> {
                    GradeDTO dto = objectMapper.convertValue(entity, GradeDTO.class);
                    dto.setGrade(entity.getGrade());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public Long save (GradeDTO dto) {
        Grade entity = (dto.getIdentifier() != null)
                ? repo.findById(dto.getIdentifier()).orElse(new Grade())
                : new Grade();
        entity.setGrade(dto.getGrade());
        entity.setDescription(dto.getDescription());

            if (dto.getSections() != null) {
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
                    sc.setGrade(entity);
                    newList.add(sc);
                }
                entity.getSections().clear();
                entity.getSections().addAll(newList);
        }

        return repo.save(entity).getIdentifier();
    }

    public GradeDTO details (Long identifier) {
    Grade entity = repo.findById(identifier)
        .orElseThrow(() -> new RuntimeException("Grade not found with ID: " + identifier));
    GradeDTO dto = objectMapper.convertValue(entity, GradeDTO.class);
    dto.setGrade(entity.getGrade());
    return dto;
    }

    public String delete(Long identifier) {
        if (!repo.existsById(identifier)) {
            throw new RuntimeException("Grade not found with ID: " + identifier);
        }
        repo.deleteById(identifier);
        return "success";
    }

}
