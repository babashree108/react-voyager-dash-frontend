package com.nxtclass.controller;

import com.nxtclass.dto.StatResponse;
import com.nxtclass.entity.AssignmentStatus;
import com.nxtclass.entity.UserRole;
import com.nxtclass.repository.AssignmentRepository;
import com.nxtclass.repository.GradeRepo;
import com.nxtclass.repository.StudentDetailsRepo;
import com.nxtclass.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping("/api/stats")
public class StatsController {
    private final UserRepository userRepository;
    private final StudentDetailsRepo studentDetailsRepo;
    private final GradeRepo gradeRepo;
    private final AssignmentRepository assignmentRepository;

    public StatsController(
            UserRepository userRepository,
            StudentDetailsRepo studentDetailsRepo,
            GradeRepo gradeRepo,
            AssignmentRepository assignmentRepository
    ) {
        this.userRepository = userRepository;
        this.studentDetailsRepo = studentDetailsRepo;
        this.gradeRepo = gradeRepo;
        this.assignmentRepository = assignmentRepository;
    }

    @GetMapping
    public ResponseEntity<List<StatResponse>> getStats(@RequestParam(defaultValue = "orgadmin") String type) {
        String normalizedType = type.toLowerCase(Locale.ROOT);
        List<StatResponse> stats = switch (normalizedType) {
            case "orgadmin" -> buildOrgAdminStats();
            case "teacher" -> buildTeacherStats();
            case "student" -> buildStudentStats();
            default -> List.of();
        };

        return ResponseEntity.ok(stats);
    }

    private List<StatResponse> buildOrgAdminStats() {
        long totalUsers = userRepository.count();
        long teacherCount = userRepository.countByRole(UserRole.TEACHER);
        long studentCount = userRepository.countByRole(UserRole.STUDENT);
        long gradeCount = gradeRepo.count();

        return List.of(
                new StatResponse("Total Users", totalUsers, null, "up"),
                new StatResponse("Active grades", gradeCount, null, "up"),
                new StatResponse("Teachers", teacherCount, null, "up"),
                new StatResponse("Students", studentCount, null, "up")
        );
    }

    private List<StatResponse> buildTeacherStats() {
        long myClasses = gradeRepo.count();
        long totalStudents = studentDetailsRepo.count();
        long totalAssignments = assignmentRepository.count();
        long pendingAssignments = assignmentRepository.countByStatus(AssignmentStatus.PENDING);

        return List.of(
                new StatResponse("My Classes", myClasses, null, "up"),
                new StatResponse("Total Students", totalStudents, null, "up"),
                new StatResponse("Assignments", totalAssignments, pendingAssignments + " due", "up"),
                new StatResponse("Avg. Attendance", "92%", null, "up")
        );
    }

    private List<StatResponse> buildStudentStats() {
        long enrolledClasses = gradeRepo.count();
        long assignmentsDue = assignmentRepository.countByStatus(AssignmentStatus.PENDING);

        return List.of(
                new StatResponse("Enrolled Classes", enrolledClasses, "On track", "up"),
                new StatResponse("Assignments Due", assignmentsDue, "This week", "up"),
                new StatResponse("Overall Grade", "A-", "Stable", "up"),
                new StatResponse("Attendance", "95%", "Excellent", "up")
        );
    }
}
