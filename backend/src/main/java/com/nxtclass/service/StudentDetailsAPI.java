package com.nxtclass.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nxtclass.dto.StudentDetailsDTO;
import com.nxtclass.entity.StudentDetails;
import com.nxtclass.repository.StudentDetailsRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentDetailsAPI {

    private final StudentDetailsRepo repo;

    private final ObjectMapper objectMapper;

    public List<StudentDetailsDTO> list() {
        List<StudentDetails> entities = repo.findAll();
        return entities.stream()
                .map(entity -> objectMapper.convertValue(entity, StudentDetailsDTO.class))
                .collect(Collectors.toList());
    }

    public Long save (StudentDetailsDTO dto) {
        StudentDetails entity = (dto.getIdentifier() != null)
                ? repo.findById(dto.getIdentifier()).orElse(new StudentDetails())
                : new StudentDetails();
        entity.setFName(dto.getFName());
        entity.setLName(dto.getLName());
        entity.setEmail(dto.getEmail());
        entity.setPhoneNo(dto.getPhoneNo());
        entity.setGradeIdentifier(dto.getGradeIdentifier());
        entity.setSectionIdentifier(dto.getSectionIdentifier());
        entity.setLecture(dto.getLecture());
        entity.setAddress1(dto.getAddress1());
        entity.setAddress2(dto.getAddress2());
        entity.setPincode(dto.getPincode());
        entity.setState(dto.getState());
        entity.setCountry(dto.getCountry());
        entity.setAdharNo(dto.getAdharNo());
        return repo.save(entity).getIdentifier();
    }

    public StudentDetailsDTO details (Long identifier) {
        StudentDetails entity = repo.findById(identifier)
                .orElseThrow(() -> new RuntimeException("Student not found with ID: " + identifier));
        return objectMapper.convertValue(entity, StudentDetailsDTO.class);
    }

    public String delete(Long identifier) {
        if (!repo.existsById(identifier)) {
            throw new RuntimeException("Student not found with ID: " + identifier);
        }
        repo.deleteById(identifier);
        return "success";
    }

}
