package com.nxtclass.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nxtclass.domain.Subject;
import com.nxtclass.dto.SubjectDTO;
import com.nxtclass.repository.SubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubjectAPI {
    
    private final SubjectRepository repo;
    private final ObjectMapper objectMapper;

    public List<SubjectDTO> list() {
        List<Subject> entities = repo.findAll();
        return entities.stream()
                .map(entity -> objectMapper.convertValue(entity, SubjectDTO.class))
                .collect(Collectors.toList());
    }
    public void save(List<SubjectDTO> dtos) {
        List<Subject> entities = dtos.stream()
                .map(dto -> {
                    Subject entity = (dto.getIdentifier() != null)
                            ? repo.findById(dto.getIdentifier()).orElse(new Subject())
                            : new Subject();
                    entity.setSubject(dto.getSubject());
                    return entity;
                })
                .collect(Collectors.toList());

        repo.saveAll(entities);
    }

    public void update(SubjectDTO dto) {
        if (dto.getIdentifier() == null) {
            throw new RuntimeException("Identifier is required for update.");
        }

        Subject entity = repo.findById(dto.getIdentifier())
                .orElseThrow(() -> new RuntimeException("Subject not found with ID: " + dto.getIdentifier()));

        entity.setSubject(dto.getSubject());
        repo.save(entity);
    }

    public SubjectDTO details(Long identifier) {
        Subject entity = repo.findById(identifier)
                .orElseThrow(() -> new RuntimeException("Subject not found with ID: " + identifier));
        return objectMapper.convertValue(entity, SubjectDTO.class);
    }

    public String delete(Long identifier) {
        if (!repo.existsById(identifier)) {
            throw new RuntimeException("Subject not found with ID: " + identifier);
        }
        repo.deleteById(identifier);
        return "success";
    }
}