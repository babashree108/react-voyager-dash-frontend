# NXT Class - Comprehensive Database Design

## Overview
This document outlines the complete database schema for the NXT Class education management platform, designed for efficient data retrieval, proper relationships, and optimized dashboard metrics.

## Database Architecture

### Design Principles
1. **Normalization**: Proper 3NF normalization with strategic denormalization for performance
2. **Referential Integrity**: Foreign keys maintain data consistency
3. **Indexing Strategy**: Optimized indexes for dashboard queries
4. **Scalability**: Designed to handle multiple organizations and thousands of users
5. **Audit Trail**: Timestamps on all major tables
6. **Performance**: Materialized views for complex dashboard metrics

## Core Entities and Relationships

### 1. User Management
```
organizations (1) ──────── (M) users
                 └───────── (M) subjects
                 └───────── (M) courses
```

### 2. Academic Structure
```
subjects (1) ──────── (M) courses
courses (1) ──────── (M) lectures
       └─────────── (M) enrollments
       └─────────── (M) assignments

users (teacher) (1) ──────── (M) courses
users (student) (1) ──────── (M) enrollments
```

### 3. Learning Activities
```
lectures (1) ──────── (M) lecture_attendance
assignments (1) ──────── (M) assignment_submissions
courses (1) ──────── (M) grades
```

## Detailed Table Structure

### Core Tables

#### 1. **organizations**
Central multi-tenant table
- `id`: BIGSERIAL PRIMARY KEY
- `name`: VARCHAR(255) NOT NULL
- `domain`: VARCHAR(255) UNIQUE
- `settings`: JSONB (customization settings)
- `is_active`: BOOLEAN DEFAULT TRUE
- `created_at`, `updated_at`: TIMESTAMP

**Purpose**: Multi-tenant support, organization-level settings

---

#### 2. **users**
Central user table for all roles
- `id`: BIGSERIAL PRIMARY KEY
- `organization_id`: BIGINT FK → organizations(id)
- `name`: VARCHAR(255) NOT NULL
- `email`: VARCHAR(255) UNIQUE NOT NULL
- `password`: VARCHAR(255) NOT NULL
- `role`: ENUM('ORGADMIN', 'TEACHER', 'STUDENT')
- `status`: ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED')
- `avatar_url`: VARCHAR(500)
- `phone`: VARCHAR(20)
- `created_at`, `updated_at`: TIMESTAMP

**Purpose**: Unified user authentication and role management

---

#### 3. **student_details**
Extended student information
- `id`: BIGSERIAL PRIMARY KEY
- `user_id`: BIGINT FK → users(id) UNIQUE
- `first_name`: VARCHAR(100) NOT NULL
- `last_name`: VARCHAR(100) NOT NULL
- `date_of_birth`: DATE
- `guardian_name`: VARCHAR(255)
- `guardian_phone`: VARCHAR(20)
- `guardian_email`: VARCHAR(255)
- `address_line1`: VARCHAR(255)
- `address_line2`: VARCHAR(255)
- `city`: VARCHAR(100)
- `state`: VARCHAR(100)
- `country`: VARCHAR(100)
- `pincode`: VARCHAR(20)
- `aadhar_number`: VARCHAR(20)
- `admission_date`: DATE
- `grade_level`: VARCHAR(20)
- `created_at`, `updated_at`: TIMESTAMP

**Purpose**: Detailed student profile and contact information

---

#### 4. **teacher_details**
Extended teacher information
- `id`: BIGSERIAL PRIMARY KEY
- `user_id`: BIGINT FK → users(id) UNIQUE
- `first_name`: VARCHAR(100) NOT NULL
- `last_name`: VARCHAR(100) NOT NULL
- `qualification`: VARCHAR(255)
- `specialization`: VARCHAR(255)
- `experience_years`: INTEGER
- `joining_date`: DATE
- `employee_id`: VARCHAR(50) UNIQUE
- `phone`: VARCHAR(20)
- `created_at`, `updated_at`: TIMESTAMP

**Purpose**: Teacher profile and professional information

---

### Academic Structure Tables

#### 5. **subjects**
Academic subjects
- `id`: BIGSERIAL PRIMARY KEY
- `organization_id`: BIGINT FK → organizations(id)
- `name`: VARCHAR(255) NOT NULL
- `code`: VARCHAR(50) UNIQUE
- `description`: TEXT
- `grade_level`: VARCHAR(20)
- `is_active`: BOOLEAN DEFAULT TRUE
- `created_at`, `updated_at`: TIMESTAMP

**Purpose**: Subject catalog for the organization

---

#### 6. **courses**
Course instances (a subject taught in a specific term)
- `id`: BIGSERIAL PRIMARY KEY
- `subject_id`: BIGINT FK → subjects(id)
- `teacher_id`: BIGINT FK → users(id)
- `organization_id`: BIGINT FK → organizations(id)
- `course_code`: VARCHAR(50) UNIQUE
- `title`: VARCHAR(255) NOT NULL
- `description`: TEXT
- `term`: VARCHAR(50) (e.g., 'Fall 2025', 'Spring 2025')
- `academic_year`: VARCHAR(20)
- `start_date`: DATE NOT NULL
- `end_date`: DATE NOT NULL
- `max_students`: INTEGER
- `room`: VARCHAR(100)
- `schedule`: JSONB (days and times)
- `status`: ENUM('ACTIVE', 'COMPLETED', 'CANCELLED')
- `created_at`, `updated_at`: TIMESTAMP

**Purpose**: Specific course offerings with schedule and capacity

---

#### 7. **enrollments**
Student course enrollments
- `id`: BIGSERIAL PRIMARY KEY
- `course_id`: BIGINT FK → courses(id)
- `student_id`: BIGINT FK → users(id)
- `enrollment_date`: DATE NOT NULL
- `status`: ENUM('ENROLLED', 'COMPLETED', 'DROPPED', 'WITHDRAWN')
- `final_grade`: VARCHAR(5)
- `final_percentage`: DECIMAL(5,2)
- `attendance_percentage`: DECIMAL(5,2)
- `created_at`, `updated_at`: TIMESTAMP
- UNIQUE(course_id, student_id)

**Purpose**: Track which students are enrolled in which courses

---

#### 8. **lectures**
Individual lecture/class sessions
- `id`: BIGSERIAL PRIMARY KEY
- `course_id`: BIGINT FK → courses(id)
- `title`: VARCHAR(255) NOT NULL
- `description`: TEXT
- `lecture_date`: DATE NOT NULL
- `start_time`: TIME NOT NULL
- `end_time`: TIME NOT NULL
- `duration_minutes`: INTEGER NOT NULL
- `location`: VARCHAR(255)
- `meeting_url`: VARCHAR(500)
- `recording_url`: VARCHAR(500)
- `status`: ENUM('SCHEDULED', 'LIVE', 'COMPLETED', 'CANCELLED')
- `materials`: JSONB (links to resources)
- `created_at`, `updated_at`: TIMESTAMP

**Purpose**: Individual class session management

---

#### 9. **lecture_attendance**
Student attendance for each lecture
- `id`: BIGSERIAL PRIMARY KEY
- `lecture_id`: BIGINT FK → lectures(id)
- `student_id`: BIGINT FK → users(id)
- `status`: ENUM('PRESENT', 'ABSENT', 'LATE', 'EXCUSED')
- `check_in_time`: TIMESTAMP
- `check_out_time`: TIMESTAMP
- `duration_minutes`: INTEGER
- `notes`: TEXT
- `created_at`: TIMESTAMP
- UNIQUE(lecture_id, student_id)

**Purpose**: Track attendance for each lecture session

---

### Assessment Tables

#### 10. **assignments**
Course assignments
- `id`: BIGSERIAL PRIMARY KEY
- `course_id`: BIGINT FK → courses(id)
- `teacher_id`: BIGINT FK → users(id)
- `title`: VARCHAR(255) NOT NULL
- `description`: TEXT
- `instructions`: TEXT
- `due_date`: TIMESTAMP NOT NULL
- `max_points`: DECIMAL(6,2) NOT NULL
- `weight_percentage`: DECIMAL(5,2)
- `assignment_type`: ENUM('HOMEWORK', 'QUIZ', 'EXAM', 'PROJECT', 'LAB')
- `allow_late_submission`: BOOLEAN DEFAULT FALSE
- `late_penalty_percentage`: DECIMAL(5,2)
- `file_url`: VARCHAR(500)
- `status`: ENUM('DRAFT', 'PUBLISHED', 'CLOSED')
- `created_at`, `updated_at`: TIMESTAMP

**Purpose**: Assignment creation and configuration

---

#### 11. **assignment_submissions**
Student assignment submissions
- `id`: BIGSERIAL PRIMARY KEY
- `assignment_id`: BIGINT FK → assignments(id)
- `student_id`: BIGINT FK → users(id)
- `submission_date`: TIMESTAMP
- `submitted_text`: TEXT
- `file_urls`: JSONB (array of file URLs)
- `points_earned`: DECIMAL(6,2)
- `max_points`: DECIMAL(6,2)
- `percentage`: DECIMAL(5,2)
- `status`: ENUM('NOT_SUBMITTED', 'SUBMITTED', 'GRADED', 'RETURNED', 'LATE')
- `feedback`: TEXT
- `graded_by`: BIGINT FK → users(id)
- `graded_at`: TIMESTAMP
- `attempts`: INTEGER DEFAULT 1
- `created_at`, `updated_at`: TIMESTAMP
- UNIQUE(assignment_id, student_id)

**Purpose**: Track student submissions and grades

---

#### 12. **grades**
Overall course grades
- `id`: BIGSERIAL PRIMARY KEY
- `enrollment_id`: BIGINT FK → enrollments(id) UNIQUE
- `course_id`: BIGINT FK → courses(id)
- `student_id`: BIGINT FK → users(id)
- `total_points_earned`: DECIMAL(8,2)
- `total_points_possible`: DECIMAL(8,2)
- `percentage`: DECIMAL(5,2)
- `letter_grade`: VARCHAR(5)
- `gpa`: DECIMAL(3,2)
- `midterm_grade`: VARCHAR(5)
- `final_grade`: VARCHAR(5)
- `comments`: TEXT
- `calculated_at`: TIMESTAMP
- `created_at`, `updated_at`: TIMESTAMP

**Purpose**: Aggregate grade calculation for courses

---

### Communication Tables

#### 13. **announcements**
System-wide announcements
- `id`: BIGSERIAL PRIMARY KEY
- `organization_id`: BIGINT FK → organizations(id)
- `author_id`: BIGINT FK → users(id)
- `title`: VARCHAR(255) NOT NULL
- `content`: TEXT NOT NULL
- `priority`: ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT')
- `target_audience`: ENUM('ALL', 'STUDENTS', 'TEACHERS', 'PARENTS', 'ADMINS')
- `course_id`: BIGINT FK → courses(id) (nullable, for course-specific)
- `is_published`: BOOLEAN DEFAULT TRUE
- `publish_date`: TIMESTAMP
- `expire_date`: TIMESTAMP
- `created_at`, `updated_at`: TIMESTAMP

**Purpose**: Communication and notifications

---

#### 14. **notifications**
User-specific notifications
- `id`: BIGSERIAL PRIMARY KEY
- `user_id`: BIGINT FK → users(id)
- `type`: VARCHAR(50) NOT NULL
- `title`: VARCHAR(255) NOT NULL
- `message`: TEXT NOT NULL
- `related_entity_type`: VARCHAR(50)
- `related_entity_id`: BIGINT
- `is_read`: BOOLEAN DEFAULT FALSE
- `read_at`: TIMESTAMP
- `created_at`: TIMESTAMP

**Purpose**: Personal notifications for users

---

### Digital Learning Tables

#### 15. **digital_notebooks**
Digital note-taking
- `id`: BIGSERIAL PRIMARY KEY
- `user_id`: BIGINT FK → users(id)
- `lecture_id`: BIGINT FK → lectures(id) (nullable)
- `course_id`: BIGINT FK → courses(id) (nullable)
- `title`: VARCHAR(255) NOT NULL
- `content`: JSONB
- `tags`: TEXT[]
- `is_shared`: BOOLEAN DEFAULT FALSE
- `created_at`, `updated_at`: TIMESTAMP

**Purpose**: Digital notebook integration (Huion Note X10)

---

### Analytics Tables

#### 16. **analytics_events**
Event tracking for analytics
- `id`: BIGSERIAL PRIMARY KEY
- `user_id`: BIGINT FK → users(id)
- `organization_id`: BIGINT FK → organizations(id)
- `event_type`: VARCHAR(100) NOT NULL
- `event_category`: VARCHAR(50)
- `event_data`: JSONB
- `ip_address`: INET
- `user_agent`: TEXT
- `session_id`: VARCHAR(100)
- `created_at`: TIMESTAMP

**Purpose**: Track user activity for analytics

---

## Dashboard Metrics Views

### View 1: **dashboard_student_stats**
```sql
CREATE MATERIALIZED VIEW dashboard_student_stats AS
SELECT 
    s.user_id,
    COUNT(DISTINCT e.course_id) as enrolled_courses_count,
    COUNT(DISTINCT CASE WHEN a.status = 'PUBLISHED' AND a.due_date > NOW() THEN a.id END) as assignments_due_count,
    ROUND(AVG(asub.percentage), 2) as average_assignment_score,
    ROUND(AVG(la.duration_minutes) * 100.0 / AVG(l.duration_minutes), 2) as average_attendance_percentage,
    ROUND(AVG(g.percentage), 2) as overall_gpa_percentage
FROM student_details s
LEFT JOIN enrollments e ON e.student_id = s.user_id AND e.status = 'ENROLLED'
LEFT JOIN assignments a ON a.course_id = e.course_id
LEFT JOIN assignment_submissions asub ON asub.assignment_id = a.id AND asub.student_id = s.user_id
LEFT JOIN lecture_attendance la ON la.student_id = s.user_id
LEFT JOIN lectures l ON l.id = la.lecture_id
LEFT JOIN grades g ON g.student_id = s.user_id
GROUP BY s.user_id;

CREATE UNIQUE INDEX idx_dashboard_student_stats_user ON dashboard_student_stats(user_id);
```

### View 2: **dashboard_teacher_stats**
```sql
CREATE MATERIALIZED VIEW dashboard_teacher_stats AS
SELECT 
    t.user_id,
    COUNT(DISTINCT c.id) as total_courses,
    COUNT(DISTINCT e.student_id) as total_students,
    COUNT(DISTINCT a.id) as total_assignments,
    COUNT(DISTINCT CASE WHEN a.due_date < NOW() AND asub.status = 'NOT_SUBMITTED' THEN asub.id END) as pending_gradings,
    COUNT(DISTINCT l.id) as total_lectures,
    COUNT(DISTINCT CASE WHEN l.status = 'SCHEDULED' AND l.lecture_date >= CURRENT_DATE THEN l.id END) as upcoming_lectures,
    ROUND(AVG(CASE WHEN la.status = 'PRESENT' THEN 1 ELSE 0 END) * 100, 2) as average_attendance_rate
FROM teacher_details t
LEFT JOIN courses c ON c.teacher_id = t.user_id AND c.status = 'ACTIVE'
LEFT JOIN enrollments e ON e.course_id = c.id AND e.status = 'ENROLLED'
LEFT JOIN assignments a ON a.course_id = c.id
LEFT JOIN assignment_submissions asub ON asub.assignment_id = a.id
LEFT JOIN lectures l ON l.course_id = c.id
LEFT JOIN lecture_attendance la ON la.lecture_id = l.id
GROUP BY t.user_id;

CREATE UNIQUE INDEX idx_dashboard_teacher_stats_user ON dashboard_teacher_stats(user_id);
```

### View 3: **dashboard_org_admin_stats**
```sql
CREATE MATERIALIZED VIEW dashboard_org_admin_stats AS
SELECT 
    o.id as organization_id,
    COUNT(DISTINCT u.id) as total_users,
    COUNT(DISTINCT CASE WHEN u.role = 'STUDENT' THEN u.id END) as total_students,
    COUNT(DISTINCT CASE WHEN u.role = 'TEACHER' THEN u.id END) as total_teachers,
    COUNT(DISTINCT c.id) as total_courses,
    COUNT(DISTINCT CASE WHEN c.status = 'ACTIVE' THEN c.id END) as active_courses,
    COUNT(DISTINCT l.id) as total_lectures,
    COUNT(DISTINCT CASE WHEN l.status = 'LIVE' THEN l.id END) as live_lectures,
    COUNT(DISTINCT a.id) as total_assignments,
    ROUND(AVG(CASE WHEN la.status = 'PRESENT' THEN 1 ELSE 0 END) * 100, 2) as overall_attendance_rate
FROM organizations o
LEFT JOIN users u ON u.organization_id = o.id AND u.status = 'ACTIVE'
LEFT JOIN courses c ON c.organization_id = o.id
LEFT JOIN lectures l ON l.course_id = c.id
LEFT JOIN assignments a ON a.course_id = c.id
LEFT JOIN lecture_attendance la ON la.lecture_id = l.id
GROUP BY o.id;

CREATE UNIQUE INDEX idx_dashboard_org_admin_stats_org ON dashboard_org_admin_stats(organization_id);
```

## Indexing Strategy

### Primary Indexes (automatically created with PRIMARY KEY)
All tables have primary key indexes on their `id` column.

### Foreign Key Indexes
```sql
-- Users
CREATE INDEX idx_users_organization ON users(organization_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

-- Student/Teacher Details
CREATE INDEX idx_student_details_user ON student_details(user_id);
CREATE INDEX idx_teacher_details_user ON teacher_details(user_id);

-- Subjects
CREATE INDEX idx_subjects_organization ON subjects(organization_id);
CREATE INDEX idx_subjects_code ON subjects(code);

-- Courses
CREATE INDEX idx_courses_subject ON courses(subject_id);
CREATE INDEX idx_courses_teacher ON courses(teacher_id);
CREATE INDEX idx_courses_organization ON courses(organization_id);
CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_courses_dates ON courses(start_date, end_date);

-- Enrollments
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);

-- Lectures
CREATE INDEX idx_lectures_course ON lectures(course_id);
CREATE INDEX idx_lectures_date ON lectures(lecture_date);
CREATE INDEX idx_lectures_status ON lectures(status);

-- Lecture Attendance
CREATE INDEX idx_lecture_attendance_lecture ON lecture_attendance(lecture_id);
CREATE INDEX idx_lecture_attendance_student ON lecture_attendance(student_id);
CREATE INDEX idx_lecture_attendance_status ON lecture_attendance(status);

-- Assignments
CREATE INDEX idx_assignments_course ON assignments(course_id);
CREATE INDEX idx_assignments_teacher ON assignments(teacher_id);
CREATE INDEX idx_assignments_due_date ON assignments(due_date);
CREATE INDEX idx_assignments_status ON assignments(status);

-- Assignment Submissions
CREATE INDEX idx_assignment_submissions_assignment ON assignment_submissions(assignment_id);
CREATE INDEX idx_assignment_submissions_student ON assignment_submissions(student_id);
CREATE INDEX idx_assignment_submissions_status ON assignment_submissions(status);

-- Grades
CREATE INDEX idx_grades_enrollment ON grades(enrollment_id);
CREATE INDEX idx_grades_course ON grades(course_id);
CREATE INDEX idx_grades_student ON grades(student_id);

-- Announcements
CREATE INDEX idx_announcements_organization ON announcements(organization_id);
CREATE INDEX idx_announcements_author ON announcements(author_id);
CREATE INDEX idx_announcements_course ON announcements(course_id);
CREATE INDEX idx_announcements_dates ON announcements(publish_date, expire_date);

-- Notifications
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- Analytics
CREATE INDEX idx_analytics_user ON analytics_events(user_id);
CREATE INDEX idx_analytics_organization ON analytics_events(organization_id);
CREATE INDEX idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_created_at ON analytics_events(created_at);
```

## Query Optimization for Dashboard

### Common Dashboard Queries

#### 1. Get Student Dashboard Stats
```sql
SELECT * FROM dashboard_student_stats WHERE user_id = ?;
```

#### 2. Get Teacher Dashboard Stats
```sql
SELECT * FROM dashboard_teacher_stats WHERE user_id = ?;
```

#### 3. Get Org Admin Dashboard Stats
```sql
SELECT * FROM dashboard_org_admin_stats WHERE organization_id = ?;
```

#### 4. Get Live Lectures Count
```sql
SELECT COUNT(*) FROM lectures 
WHERE status = 'LIVE' AND lecture_date = CURRENT_DATE;
```

#### 5. Get Upcoming Assignments for Student
```sql
SELECT a.*, c.title as course_title, asub.status as submission_status
FROM assignments a
JOIN courses c ON a.course_id = c.id
JOIN enrollments e ON e.course_id = c.id
LEFT JOIN assignment_submissions asub ON asub.assignment_id = a.id AND asub.student_id = ?
WHERE e.student_id = ? 
  AND a.status = 'PUBLISHED'
  AND a.due_date > NOW()
ORDER BY a.due_date ASC
LIMIT 10;
```

## Maintenance

### Refresh Materialized Views
```sql
-- Refresh daily or after significant changes
REFRESH MATERIALIZED VIEW CONCURRENTLY dashboard_student_stats;
REFRESH MATERIALIZED VIEW CONCURRENTLY dashboard_teacher_stats;
REFRESH MATERIALIZED VIEW CONCURRENTLY dashboard_org_admin_stats;
```

### Cleanup Old Analytics Events
```sql
-- Archive events older than 90 days
DELETE FROM analytics_events WHERE created_at < NOW() - INTERVAL '90 days';
```

## Data Migration Plan

1. **Phase 1**: Core tables (organizations, users, student_details, teacher_details)
2. **Phase 2**: Academic structure (subjects, courses, enrollments)
3. **Phase 3**: Learning activities (lectures, lecture_attendance)
4. **Phase 4**: Assessments (assignments, assignment_submissions, grades)
5. **Phase 5**: Communication (announcements, notifications)
6. **Phase 6**: Analytics and views

## Backup Strategy

- **Daily**: Full database backup
- **Hourly**: Transaction log backup
- **Weekly**: Test restore procedures
- **Monthly**: Archive old data
