# Implementation Guide - Dashboard Metrics API

## Overview
This guide provides step-by-step instructions for implementing the backend APIs to fetch dashboard metrics efficiently using the new database design.

## Table of Contents
1. [Backend Entity Classes](#backend-entity-classes)
2. [Repository Interfaces](#repository-interfaces)
3. [Service Layer](#service-layer)
4. [Controller Endpoints](#controller-endpoints)
5. [Dashboard Metrics API](#dashboard-metrics-api)
6. [Frontend Integration](#frontend-integration)

---

## 1. Backend Entity Classes

### Example: Course Entity
```java
package com.nxtclass.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "courses")
@Getter
@Setter
@NoArgsConstructor
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", nullable = false)
    private User teacher;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    @Column(name = "course_code", unique = true, nullable = false)
    private String courseCode;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String term;

    @Column(name = "academic_year", nullable = false)
    private String academicYear;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "max_students")
    private Integer maxStudents = 30;

    private String room;

    @Column(columnDefinition = "jsonb")
    private String schedule; // Store as JSON string

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CourseStatus status = CourseStatus.ACTIVE;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
```

### Example: Enrollment Entity
```java
package com.nxtclass.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "enrollments", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"course_id", "student_id"})
})
@Getter
@Setter
@NoArgsConstructor
public class Enrollment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @Column(name = "enrollment_date", nullable = false)
    private LocalDate enrollmentDate = LocalDate.now();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EnrollmentStatus status = EnrollmentStatus.ENROLLED;

    @Column(name = "final_grade")
    private String finalGrade;

    @Column(name = "final_percentage", precision = 5, scale = 2)
    private BigDecimal finalPercentage;

    @Column(name = "attendance_percentage", precision = 5, scale = 2)
    private BigDecimal attendancePercentage;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
```

---

## 2. Repository Interfaces

### DashboardStatsRepository
```java
package com.nxtclass.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Map;

@Repository
public interface DashboardRepository extends JpaRepository<User, Long> {

    // Student Dashboard Stats
    @Query(nativeQuery = true, value = """
        SELECT 
            COUNT(DISTINCT e.course_id) as enrolled_courses_count,
            COUNT(DISTINCT CASE 
                WHEN a.status = 'PUBLISHED' 
                AND a.due_date > NOW() 
                AND asub.status IN ('NOT_SUBMITTED', 'SUBMITTED') 
                THEN a.id 
            END) as assignments_due_count,
            COALESCE(ROUND(AVG(CASE WHEN asub.status = 'GRADED' THEN asub.percentage END), 2), 0) as average_assignment_score,
            COALESCE(ROUND(AVG(CASE WHEN la.status = 'PRESENT' THEN 100 WHEN la.status IN ('ABSENT', 'LATE') THEN 0 END), 2), 0) as attendance_percentage,
            COALESCE(ROUND(AVG(g.percentage), 2), 0) as overall_gpa_percentage,
            COUNT(DISTINCT CASE WHEN l.lecture_date = CURRENT_DATE AND l.status = 'SCHEDULED' THEN l.id END) as lectures_today
        FROM student_details s
        LEFT JOIN enrollments e ON e.student_id = s.user_id AND e.status = 'ENROLLED'
        LEFT JOIN courses c ON c.id = e.course_id AND c.status = 'ACTIVE'
        LEFT JOIN assignments a ON a.course_id = c.id
        LEFT JOIN assignment_submissions asub ON asub.assignment_id = a.id AND asub.student_id = s.user_id
        LEFT JOIN lectures l ON l.course_id = c.id
        LEFT JOIN lecture_attendance la ON la.lecture_id = l.id AND la.student_id = s.user_id
        LEFT JOIN grades g ON g.student_id = s.user_id AND g.course_id = c.id
        WHERE s.user_id = :userId
        GROUP BY s.user_id
    """)
    Map<String, Object> getStudentDashboardStats(@Param("userId") Long userId);

    // Teacher Dashboard Stats
    @Query(nativeQuery = true, value = """
        SELECT 
            COUNT(DISTINCT c.id) as total_courses,
            COUNT(DISTINCT e.student_id) as total_students,
            COUNT(DISTINCT a.id) as total_assignments,
            COUNT(DISTINCT CASE WHEN asub.status = 'SUBMITTED' THEN asub.id END) as pending_gradings,
            COUNT(DISTINCT l.id) as total_lectures,
            COUNT(DISTINCT CASE WHEN l.status = 'SCHEDULED' AND l.lecture_date >= CURRENT_DATE THEN l.id END) as upcoming_lectures,
            COUNT(DISTINCT CASE WHEN l.lecture_date = CURRENT_DATE AND l.status IN ('SCHEDULED', 'LIVE') THEN l.id END) as lectures_today,
            COALESCE(ROUND(AVG(CASE WHEN la.status = 'PRESENT' THEN 100 ELSE 0 END), 2), 0) as average_attendance_rate
        FROM teacher_details t
        LEFT JOIN courses c ON c.teacher_id = t.user_id AND c.status = 'ACTIVE'
        LEFT JOIN enrollments e ON e.course_id = c.id AND e.status = 'ENROLLED'
        LEFT JOIN assignments a ON a.course_id = c.id AND a.status = 'PUBLISHED'
        LEFT JOIN assignment_submissions asub ON asub.assignment_id = a.id
        LEFT JOIN lectures l ON l.course_id = c.id
        LEFT JOIN lecture_attendance la ON la.lecture_id = l.id
        WHERE t.user_id = :userId
        GROUP BY t.user_id
    """)
    Map<String, Object> getTeacherDashboardStats(@Param("userId") Long userId);

    // Org Admin Dashboard Stats
    @Query(nativeQuery = true, value = """
        SELECT 
            COUNT(DISTINCT u.id) as total_users,
            COUNT(DISTINCT CASE WHEN u.role = 'STUDENT' AND u.status = 'ACTIVE' THEN u.id END) as total_students,
            COUNT(DISTINCT CASE WHEN u.role = 'TEACHER' AND u.status = 'ACTIVE' THEN u.id END) as total_teachers,
            COUNT(DISTINCT c.id) as total_courses,
            COUNT(DISTINCT CASE WHEN c.status = 'ACTIVE' THEN c.id END) as active_courses,
            COUNT(DISTINCT l.id) as total_lectures,
            COUNT(DISTINCT CASE WHEN l.status = 'LIVE' THEN l.id END) as live_lectures,
            COUNT(DISTINCT CASE WHEN l.lecture_date = CURRENT_DATE AND l.status IN ('SCHEDULED', 'LIVE') THEN l.id END) as lectures_today,
            COUNT(DISTINCT a.id) as total_assignments,
            COALESCE(ROUND(AVG(CASE WHEN la.status = 'PRESENT' THEN 100 ELSE 0 END), 2), 0) as overall_attendance_rate
        FROM organizations o
        LEFT JOIN users u ON u.organization_id = o.id
        LEFT JOIN courses c ON c.organization_id = o.id
        LEFT JOIN lectures l ON l.course_id = c.id
        LEFT JOIN assignments a ON a.course_id = c.id
        LEFT JOIN lecture_attendance la ON la.lecture_id = l.id
        WHERE o.id = :organizationId AND o.is_active = TRUE
        GROUP BY o.id
    """)
    Map<String, Object> getOrgAdminDashboardStats(@Param("organizationId") Long organizationId);
}
```

### StudentDetailsRepository Enhancement
```java
package com.nxtclass.repository;

import com.nxtclass.entity.StudentDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentDetailsRepository extends JpaRepository<StudentDetails, Long> {
    
    StudentDetails findByUserId(Long userId);
    
    @Query("SELECT COUNT(s) FROM StudentDetails s JOIN s.user u WHERE u.status = 'ACTIVE'")
    Long countActiveStudents();
    
    @Query("SELECT COUNT(s) FROM StudentDetails s JOIN s.user u WHERE u.status = 'ACTIVE' AND u.organization.id = :orgId")
    Long countActiveStudentsByOrganization(@Param("orgId") Long organizationId);
}
```

---

## 3. Service Layer

### DashboardService
```java
package com.nxtclass.service;

import com.nxtclass.dto.*;
import com.nxtclass.entity.UserRole;
import com.nxtclass.repository.DashboardRepository;
import com.nxtclass.repository.StudentDetailsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {
    
    private final DashboardRepository dashboardRepository;
    private final StudentDetailsRepository studentDetailsRepository;

    @Transactional(readOnly = true)
    public List<StatDTO> getDashboardStats(Long userId, UserRole role, Long organizationId) {
        return switch (role) {
            case STUDENT -> getStudentStats(userId);
            case TEACHER -> getTeacherStats(userId);
            case ORGADMIN -> getOrgAdminStats(organizationId);
        };
    }

    private List<StatDTO> getStudentStats(Long userId) {
        Map<String, Object> stats = dashboardRepository.getStudentDashboardStats(userId);
        
        List<StatDTO> statList = new ArrayList<>();
        
        statList.add(new StatDTO(
            "Enrolled Classes",
            getValueAsString(stats.get("enrolled_courses_count")),
            "On track",
            "up"
        ));
        
        statList.add(new StatDTO(
            "Assignments Due",
            getValueAsString(stats.get("assignments_due_count")),
            "This week",
            "up"
        ));
        
        statList.add(new StatDTO(
            "Overall Grade",
            formatPercentage(stats.get("overall_gpa_percentage")),
            getGradeChange(stats.get("overall_gpa_percentage")),
            "up"
        ));
        
        statList.add(new StatDTO(
            "Attendance",
            formatPercentage(stats.get("attendance_percentage")),
            getAttendanceStatus(stats.get("attendance_percentage")),
            "up"
        ));
        
        return statList;
    }

    private List<StatDTO> getTeacherStats(Long userId) {
        Map<String, Object> stats = dashboardRepository.getTeacherDashboardStats(userId);
        
        List<StatDTO> statList = new ArrayList<>();
        
        statList.add(new StatDTO(
            "My Classes",
            getValueAsString(stats.get("total_courses")),
            null,
            "up"
        ));
        
        statList.add(new StatDTO(
            "Total Students",
            getValueAsString(stats.get("total_students")),
            "+8%",
            "up"
        ));
        
        statList.add(new StatDTO(
            "Assignments",
            getValueAsString(stats.get("total_assignments")),
            getValueAsString(stats.get("pending_gradings")) + " to grade",
            "up"
        ));
        
        statList.add(new StatDTO(
            "Avg. Attendance",
            formatPercentage(stats.get("average_attendance_rate")),
            "+3%",
            "up"
        ));
        
        return statList;
    }

    private List<StatDTO> getOrgAdminStats(Long organizationId) {
        Map<String, Object> stats = dashboardRepository.getOrgAdminDashboardStats(organizationId);
        
        List<StatDTO> statList = new ArrayList<>();
        
        statList.add(new StatDTO(
            "Total Users",
            getValueAsString(stats.get("total_users")),
            "+12%",
            "up"
        ));
        
        statList.add(new StatDTO(
            "Active Classes",
            getValueAsString(stats.get("active_courses")),
            "+5%",
            "up"
        ));
        
        statList.add(new StatDTO(
            "Teachers",
            getValueAsString(stats.get("total_teachers")),
            "+2",
            "up"
        ));
        
        statList.add(new StatDTO(
            "Students",
            getValueAsString(stats.get("total_students")),
            "+10%",
            "up"
        ));
        
        return statList;
    }

    @Transactional(readOnly = true)
    public Long getStudentCount(Long organizationId) {
        if (organizationId == null) {
            return studentDetailsRepository.countActiveStudents();
        }
        return studentDetailsRepository.countActiveStudentsByOrganization(organizationId);
    }

    // Helper methods
    private String getValueAsString(Object value) {
        if (value == null) return "0";
        return value.toString();
    }

    private String formatPercentage(Object value) {
        if (value == null) return "0%";
        BigDecimal decimal = new BigDecimal(value.toString());
        return decimal.intValue() + "%";
    }

    private String getGradeChange(Object percentage) {
        if (percentage == null) return "No change";
        BigDecimal decimal = new BigDecimal(percentage.toString());
        if (decimal.compareTo(new BigDecimal("90")) >= 0) return "Excellent";
        if (decimal.compareTo(new BigDecimal("80")) >= 0) return "Good";
        if (decimal.compareTo(new BigDecimal("70")) >= 0) return "Average";
        return "Needs improvement";
    }

    private String getAttendanceStatus(Object percentage) {
        if (percentage == null) return "No data";
        BigDecimal decimal = new BigDecimal(percentage.toString());
        if (decimal.compareTo(new BigDecimal("90")) >= 0) return "Excellent";
        if (decimal.compareTo(new BigDecimal("75")) >= 0) return "Good";
        return "Needs improvement";
    }
}
```

---

## 4. Controller Endpoints

### DashboardController
```java
package com.nxtclass.controller;

import com.nxtclass.dto.StatDTO;
import com.nxtclass.entity.User;
import com.nxtclass.entity.UserRole;
import com.nxtclass.service.DashboardService;
import com.nxtclass.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DashboardController {

    private final DashboardService dashboardService;
    private final JwtService jwtService;

    @GetMapping("/stats")
    public ResponseEntity<List<StatDTO>> getDashboardStats(
            Authentication authentication
    ) {
        // Get user from authentication token
        User user = (User) authentication.getPrincipal();
        
        List<StatDTO> stats = dashboardService.getDashboardStats(
            user.getId(),
            user.getRole(),
            user.getOrganization() != null ? user.getOrganization().getId() : null
        );
        
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/stats/{role}")
    public ResponseEntity<List<StatDTO>> getDashboardStatsByRole(
            @PathVariable String role,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        UserRole userRole = UserRole.valueOf(role.toUpperCase());
        
        List<StatDTO> stats = dashboardService.getDashboardStats(
            user.getId(),
            userRole,
            user.getOrganization() != null ? user.getOrganization().getId() : null
        );
        
        return ResponseEntity.ok(stats);
    }
}
```

### Enhanced StudentDetailsController
```java
package com.nxtclass.controller;

import com.nxtclass.dto.StudentDetailsDTO;
import com.nxtclass.entity.User;
import com.nxtclass.service.DashboardService;
import com.nxtclass.service.StudentDetailsAPI;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/student-details")
@CrossOrigin(origins = "*")
public class StudentDetailsController {
    
    private final StudentDetailsAPI studentDetailsAPI;
    private final DashboardService dashboardService;

    @GetMapping("list")
    public ResponseEntity<List<StudentDetailsDTO>> list() {
        List<StudentDetailsDTO> students = studentDetailsAPI.list();
        return ResponseEntity.ok(students);
    }

    @GetMapping("count")
    public ResponseEntity<Long> count(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Long organizationId = user.getOrganization() != null ? user.getOrganization().getId() : null;
        Long count = dashboardService.getStudentCount(organizationId);
        return ResponseEntity.ok(count);
    }

    // ... other endpoints
}
```

---

## 5. Dashboard Metrics API

### DTOs

#### StatDTO
```java
package com.nxtclass.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatDTO {
    private String label;
    private String value;
    private String change;
    private String trend; // "up" or "down"
}
```

### API Endpoints Summary

| Endpoint | Method | Description | Response |
|----------|--------|-------------|----------|
| `/api/dashboard/stats` | GET | Get dashboard stats for current user | `List<StatDTO>` |
| `/api/dashboard/stats/{role}` | GET | Get stats for specific role | `List<StatDTO>` |
| `/api/student-details/count` | GET | Get active student count | `Long` |

---

## 6. Frontend Integration

### Updated DataService
```typescript
// src/api/services/data.service.ts
import { ApiService } from './api.service';
import { Stat } from '@/types';

export class DataService {
  private static instance: DataService;
  private api = ApiService.getInstance();

  private constructor() {}

  public static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  // Dashboard stats
  async getDashboardStats(role?: string): Promise<Stat[]> {
    const endpoint = role ? `/dashboard/stats/${role}` : '/dashboard/stats';
    return this.api.get<Stat[]>(endpoint);
  }

  // Student count
  async getStudentCount(): Promise<number> {
    return this.api.get<number>('/student-details/count');
  }

  // Generic CRUD operations
  async getAll<T>(endpoint: string): Promise<T[]> {
    return this.api.get<T[]>(`/${endpoint}`);
  }

  async getById<T>(endpoint: string, id: string | number): Promise<T> {
    return this.api.get<T>(`/${endpoint}/${id}`);
  }

  async create<T>(endpoint: string, data: Partial<T>): Promise<T> {
    return this.api.post<T>(`/${endpoint}`, data);
  }

  async update<T>(endpoint: string, id: string | number, data: Partial<T>): Promise<T> {
    return this.api.put<T>(`/${endpoint}/${id}`, data);
  }

  async delete(endpoint: string, id: string | number): Promise<void> {
    return this.api.delete<void>(`/${endpoint}/${id}`);
  }
}
```

### Updated mockData.ts
```typescript
// src/data/mockData.ts
import { DataService } from '@/api/services/data.service';
import { Stat } from '@/types';

const dataService = DataService.getInstance();

// Function to fetch data with fallback to mock data
const fetchWithFallback = async <T>(
  fetchFn: () => Promise<T>,
  mockData: T
): Promise<T> => {
  try {
    const data = await fetchFn();
    return data;
  } catch (error) {
    console.warn('Falling back to mock data:', error);
    return mockData;
  }
};

// Fetch stats for specific role
export const getStatsForRole = async (role: string): Promise<Stat[]> => {
  return fetchWithFallback(
    () => dataService.getDashboardStats(role.toLowerCase()),
    getDefaultStatsForRole(role)
  );
};

// Get student count
export const getStudentCount = async (): Promise<number> => {
  return fetchWithFallback(
    () => dataService.getStudentCount(),
    0
  );
};

// Default mock stats (fallback)
function getDefaultStatsForRole(role: string): Stat[] {
  // Return default mock data based on role
  // ... existing mock data logic
}
```

### Updated Dashboard.tsx
```typescript
// src/pages/Dashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stat, User } from '@/types';
import { getStatsForRole } from '@/data/mockData';
import StatCard from '@/components/StatCard';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    
    const fetchStats = async () => {
      try {
        setLoading(true);
        const statsData = await getStatsForRole(user.role);
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [user]);

  if (!user || loading) return <div>Loading...</div>;

  return (
    <DashboardLayout userRole={user.role} userName={user.name}>
      <div className="p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} />
          ))}
        </div>
        
        {/* Rest of dashboard content */}
      </div>
    </DashboardLayout>
  );
}
```

---

## Testing

### Test the APIs

1. **Start the backend:**
```bash
cd backend
mvn spring-boot:run
```

2. **Test student count endpoint:**
```bash
curl -X GET http://localhost:8080/api/student-details/count \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

3. **Test dashboard stats endpoint:**
```bash
curl -X GET http://localhost:8080/api/dashboard/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

4. **Expected Response:**
```json
[
  {
    "label": "Enrolled Classes",
    "value": "6",
    "change": "On track",
    "trend": "up"
  },
  {
    "label": "Assignments Due",
    "value": "3",
    "change": "This week",
    "trend": "up"
  },
  ...
]
```

---

## Performance Optimization

### 1. Use Materialized Views
```sql
-- Refresh views periodically (cron job or scheduled task)
REFRESH MATERIALIZED VIEW CONCURRENTLY dashboard_student_stats;
REFRESH MATERIALIZED VIEW CONCURRENTLY dashboard_teacher_stats;
REFRESH MATERIALIZED VIEW CONCURRENTLY dashboard_org_admin_stats;
```

### 2. Caching Strategy
```java
@Service
public class DashboardService {
    
    @Cacheable(value = "dashboardStats", key = "#userId + '-' + #role")
    public List<StatDTO> getDashboardStats(Long userId, UserRole role, Long organizationId) {
        // ... implementation
    }
    
    @CacheEvict(value = "dashboardStats", allEntries = true)
    @Scheduled(fixedRate = 300000) // Refresh every 5 minutes
    public void evictDashboardCache() {
        // Cache will be refreshed on next request
    }
}
```

### 3. Add Redis Configuration
```yaml
# application.properties
spring.cache.type=redis
spring.redis.host=localhost
spring.redis.port=6379
spring.cache.redis.time-to-live=300000
```

---

## Troubleshooting

### Common Issues

1. **Student count returns 0:**
   - Check if StudentDetails table has data
   - Verify user_id foreign key relationships
   - Check user status is 'ACTIVE'

2. **Dashboard stats query slow:**
   - Verify all indexes are created
   - Use EXPLAIN ANALYZE on queries
   - Consider using materialized views
   - Check database connection pool settings

3. **CORS errors:**
   - Add `@CrossOrigin(origins = "*")` to controllers
   - Configure global CORS in SecurityConfig

---

## Next Steps

1. Implement remaining entity classes
2. Create repositories for all tables
3. Build service layer for each domain
4. Implement remaining controller endpoints
5. Add authentication and authorization
6. Set up database migrations (Flyway/Liquibase)
7. Write unit and integration tests
8. Deploy and monitor performance

## Conclusion

This implementation provides:
- ✅ Efficient database design with proper relationships
- ✅ Optimized queries for dashboard metrics
- ✅ Clean service layer architecture
- ✅ RESTful API endpoints
- ✅ Frontend integration with fallback support
- ✅ Performance optimization strategies
