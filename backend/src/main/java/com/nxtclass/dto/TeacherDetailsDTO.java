package com.nxtclass.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;
import com.nxtclass.dto.TeacherGradeSectionDTO;

@Getter
@Setter
public class TeacherDetailsDTO extends BaseDTO {
    // Any additional fields specific to teachers can be added here
    // assignments: list of grade + optional section for this teacher
    private List<TeacherGradeSectionDTO> teacherGradeLinking;
}