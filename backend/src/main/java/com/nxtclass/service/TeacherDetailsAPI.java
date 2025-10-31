package com.nxtclass.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nxtclass.dto.TeacherDetailsDTO;
import com.nxtclass.dto.TeacherGradeSectionDTO;
import com.nxtclass.entity.TeacherDetails;
import com.nxtclass.entity.TeacherGradeSection;
import com.nxtclass.repository.TeacherDetailsRepo;
import com.nxtclass.repository.TeacherGradeSectionRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeacherDetailsAPI {

    private final TeacherDetailsRepo repo;
    private final TeacherGradeSectionRepo teacherGradeSectionRepo;
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

        Long savedId = repo.save(entity).getIdentifier();

        // Handle assignments (grade + optional section) included in the DTO
        if (dto.getTeacherGradeLinking() != null) {
            // replace existing assignments for this teacher
            teacherGradeSectionRepo.deleteByTeacherIdentifier(savedId);

            List<TeacherGradeSection> toSave = dto.getTeacherGradeLinking().stream().map(a -> {
                TeacherGradeSection tgs = new TeacherGradeSection();
                tgs.setTeacherIdentifier(savedId);
                tgs.setGradeIdentifier(a.getGradeIdentifier());
                tgs.setSectionIdentifier(a.getSectionIdentifier());
                return tgs;
            }).collect(Collectors.toList());

            if (!toSave.isEmpty()) {
                teacherGradeSectionRepo.saveAll(toSave);
            }
        }

        return savedId;
    }

    public TeacherDetailsDTO details(Long identifier) {
        TeacherDetails entity = repo.findById(identifier)
                .orElseThrow(() -> new RuntimeException("Teacher not found with ID: " + identifier));

        TeacherDetailsDTO dto = objectMapper.convertValue(entity, TeacherDetailsDTO.class);

    // load assignments and attach to DTO (field name: teacherGradeLinking)
    List<TeacherGradeSection> assigns = teacherGradeSectionRepo.findByTeacherIdentifier(identifier);
    List<TeacherGradeSectionDTO> assignsDto = assigns.stream()
        .map(a -> objectMapper.convertValue(a, TeacherGradeSectionDTO.class))
        .collect(Collectors.toList());
    dto.setTeacherGradeLinking(assignsDto);

        return dto;
    }

    public String delete(Long identifier) {
        if (!repo.existsById(identifier)) {
            throw new RuntimeException("Teacher not found with ID: " + identifier);
        }
    // delete teacher assignments first
    teacherGradeSectionRepo.deleteByTeacherIdentifier(identifier);
        repo.deleteById(identifier);
        return "success";
    }
}