package com.nxtclass.repository;

import com.nxtclass.entity.Assignment;
import com.nxtclass.entity.AssignmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findByStatus(AssignmentStatus status);
    
    List<Assignment> findBySubject(String subject);
    
    List<Assignment> findByDueDate(LocalDate dueDate);
    
    @Query("SELECT a FROM Assignment a WHERE a.dueDate >= :startDate ORDER BY a.dueDate")
    List<Assignment> findUpcomingAssignments(@Param("startDate") LocalDate startDate);
    
    @Query("SELECT COUNT(a) FROM Assignment a WHERE a.status = :status")
    Long countByStatus(@Param("status") AssignmentStatus status);
}