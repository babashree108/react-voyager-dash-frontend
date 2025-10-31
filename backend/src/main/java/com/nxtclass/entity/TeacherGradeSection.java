package com.nxtclass.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class TeacherGradeSection extends BaseDomain {

    @Column(name = "teacher_identifier")
    private Long teacherIdentifier;

    @Column(name = "grade_identifier")
    private Long gradeIdentifier;

    @Column(name = "section_identifier")
    private Long sectionIdentifier; // nullable
}
