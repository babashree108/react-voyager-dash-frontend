package com.nxtclass.controller;

import com.nxtclass.dto.StatDto;
import com.nxtclass.entity.UserRole;
import com.nxtclass.repository.AssignmentRepository;
import com.nxtclass.repository.ClassSessionRepository;
import com.nxtclass.repository.UserRepository;
import com.nxtclass.entity.AssignmentStatus;
import com.nxtclass.entity.SessionStatus;
import com.nxtclass.entity.UserStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/stats")
@CrossOrigin(origins = "http://localhost:5173")
public class StatsController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ClassSessionRepository classSessionRepository;
    
    @Autowired
    private AssignmentRepository assignmentRepository;

    @GetMapping("/orgadmin")
    public ResponseEntity<List<StatDto>> getOrgAdminStats() {
        List<StatDto> stats = new ArrayList<>();
        
        Long totalUsers = userRepository.countAllUsers();
        Long activeClasses = classSessionRepository.countByStatus(SessionStatus.LIVE);
        Long teachers = userRepository.countByRole(UserRole.TEACHER);
        Long students = userRepository.countByRole(UserRole.STUDENT);
        
        stats.add(new StatDto("Total Users", totalUsers, "+12%", "up"));
        stats.add(new StatDto("Active Classes", activeClasses, "+5%", "up"));
        stats.add(new StatDto("Teachers", teachers, "+2", "up"));
        stats.add(new StatDto("Students", students, "+10%", "up"));
        
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/teacher")
    public ResponseEntity<List<StatDto>> getTeacherStats() {
        List<StatDto> stats = new ArrayList<>();
        
        Long myClasses = classSessionRepository.countByStatus(SessionStatus.UPCOMING);
        Long totalStudents = userRepository.countByRole(UserRole.STUDENT);
        Long assignments = assignmentRepository.countByStatus(AssignmentStatus.PENDING);
        
        stats.add(new StatDto("My Classes", myClasses, "+1", "up"));
        stats.add(new StatDto("Total Students", totalStudents, "+8%", "up"));
        stats.add(new StatDto("Assignments", assignments, "3 due", "up"));
        stats.add(new StatDto("Avg. Attendance", "92%", "+3%", "up"));
        
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/student")
    public ResponseEntity<List<StatDto>> getStudentStats() {
        List<StatDto> stats = new ArrayList<>();
        
        Long enrolledClasses = classSessionRepository.countByStatus(SessionStatus.UPCOMING);
        Long assignmentsDue = assignmentRepository.countByStatus(AssignmentStatus.PENDING);
        
        stats.add(new StatDto("Enrolled Classes", enrolledClasses, "On track", "up"));
        stats.add(new StatDto("Assignments Due", assignmentsDue, "This week", "up"));
        stats.add(new StatDto("Overall Grade", "A-", "+2%", "up"));
        stats.add(new StatDto("Attendance", "95%", "Excellent", "up"));
        
        return ResponseEntity.ok(stats);
    }
}