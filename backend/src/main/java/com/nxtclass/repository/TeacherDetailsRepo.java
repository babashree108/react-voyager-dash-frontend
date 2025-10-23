package com.nxtclass.repository;

import com.nxtclass.entity.TeacherDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeacherDetailsRepo extends JpaRepository<TeacherDetails, Long> {
}