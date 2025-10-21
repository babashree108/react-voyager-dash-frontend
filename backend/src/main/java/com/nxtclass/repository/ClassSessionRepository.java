package com.nxtclass.repository;

import com.nxtclass.entity.ClassSession;
import com.nxtclass.entity.SessionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ClassSessionRepository extends JpaRepository<ClassSession, Long> {
    List<ClassSession> findByStatus(SessionStatus status);
    
    List<ClassSession> findByTeacher(String teacher);
    
    List<ClassSession> findBySubject(String subject);
    
    List<ClassSession> findByDate(LocalDate date);
    
    @Query("SELECT cs FROM ClassSession cs WHERE cs.date >= :startDate ORDER BY cs.date, cs.time")
    List<ClassSession> findUpcomingSessions(@Param("startDate") LocalDate startDate);
    
    @Query("SELECT COUNT(cs) FROM ClassSession cs WHERE cs.status = :status")
    Long countByStatus(@Param("status") SessionStatus status);
}