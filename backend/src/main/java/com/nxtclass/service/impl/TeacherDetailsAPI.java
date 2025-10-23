package com.nxtclass.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nxtclass.dto.TeacherDetailsDTO;
import com.nxtclass.entity.TeacherDetails;
import com.nxtclass.repository.TeacherDetailsRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeacherDetailsAPI {

    private final TeacherDetailsRepo repo;
    private final ObjectMapper objectMapper;

    public List<TeacherDetailsDTO> list() {
        List<TeacherDetails> entities = repo.findAll();
        return entities.stream()
                .map(entity -> objectMapper.convertValue(entity, TeacherDetailsDTO.class))
                .collect(Collectors.toList());
    }

    public Long save(TeacherDetailsDTO dto) {
        TeacherDetails entity = (dto.getIdentifier() != null)
                ? repo.findById(dto.getIdentifier()).orElse(new TeacherDetails())
                : new TeacherDetails();
        entity.setFName(dto.getFName());
        entity.setLName(dto.getLName());
        entity.setEmail(dto.getEmail());
        entity.setPhoneNo(dto.getPhoneNo());
        entity.setAddress1(dto.getAddress1());
        entity.setAddress2(dto.getAddress2());
        entity.setPincode(dto.getPincode());
        entity.setState(dto.getState());
        entity.setCountry(dto.getCountry());
        entity.setAdharNo(dto.getAdharNo());
        return repo.save(entity).getIdentifier();
    }

    public TeacherDetailsDTO details(Long identifier) {
        TeacherDetails entity = repo.findById(identifier)
                .orElseThrow(() -> new RuntimeException("Teacher not found with ID: " + identifier));
        return objectMapper.convertValue(entity, TeacherDetailsDTO.class);
    }

    public String delete(Long identifier) {
        if (!repo.existsById(identifier)) {
            throw new RuntimeException("Teacher not found with ID: " + identifier);
        }
        repo.deleteById(identifier);
        return "success";
    }
}