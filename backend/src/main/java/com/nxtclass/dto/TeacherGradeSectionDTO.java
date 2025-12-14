package com.nxtclass.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TeacherGradeSectionDTO extends BaseDTO {
    private Long teacherIdentifier;
    private Long gradeIdentifier;
    private Long sectionIdentifier; // may be null
}
