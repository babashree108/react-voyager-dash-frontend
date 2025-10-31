package com.nxtclass.repository;

import com.nxtclass.entity.TeacherGradeSection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TeacherGradeSectionRepo extends JpaRepository<TeacherGradeSection, Long> {
    List<TeacherGradeSection> findByTeacherIdentifier(Long teacherIdentifier);
    void deleteByTeacherIdentifier(Long teacherIdentifier);
}
