package com.nxtclass.repository;

import com.nxtclass.entity.StudentDetails;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentDetailsRepo extends JpaRepository<StudentDetails, Long> {
}
