-- ============================================================================
-- NXT Class - Enhanced Database Schema
-- Version: 2.0
-- Description: Complete schema with proper relationships for dashboard metrics
-- ============================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search optimization

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- Organizations Table
CREATE TABLE IF NOT EXISTS organizations (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE,
    settings JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Users Table (Central authentication table)
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    organization_id BIGINT REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('ORGADMIN', 'TEACHER', 'STUDENT')),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
    avatar_url VARCHAR(500),
    phone VARCHAR(20),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Student Details Table (Extended student information)
CREATE TABLE IF NOT EXISTS student_details (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    guardian_name VARCHAR(255),
    guardian_phone VARCHAR(20),
    guardian_email VARCHAR(255),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    pincode VARCHAR(20),
    aadhar_number VARCHAR(20),
    admission_date DATE,
    grade_level VARCHAR(20),
    emergency_contact VARCHAR(20),
    blood_group VARCHAR(5),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Teacher Details Table (Extended teacher information)
CREATE TABLE IF NOT EXISTS teacher_details (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    qualification VARCHAR(255),
    specialization VARCHAR(255),
    experience_years INTEGER DEFAULT 0,
    joining_date DATE,
    employee_id VARCHAR(50) UNIQUE,
    phone VARCHAR(20),
    department VARCHAR(100),
    designation VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- ACADEMIC STRUCTURE TABLES
-- ============================================================================

-- Subjects Table
CREATE TABLE IF NOT EXISTS subjects (
    id BIGSERIAL PRIMARY KEY,
    organization_id BIGINT REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    grade_level VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Courses Table (Subject instances with specific terms)
CREATE TABLE IF NOT EXISTS courses (
    id BIGSERIAL PRIMARY KEY,
    subject_id BIGINT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    teacher_id BIGINT NOT NULL REFERENCES users(id),
    organization_id BIGINT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    course_code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    term VARCHAR(50) NOT NULL, -- e.g., 'Fall 2025', 'Spring 2025'
    academic_year VARCHAR(20) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    max_students INTEGER DEFAULT 30,
    room VARCHAR(100),
    schedule JSONB DEFAULT '{}', -- {days: ['MON', 'WED'], time: '10:00-11:30'}
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'COMPLETED', 'CANCELLED')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_course_dates CHECK (end_date >= start_date)
);

-- Enrollments Table (Student-Course relationship)
CREATE TABLE IF NOT EXISTS enrollments (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    student_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'ENROLLED' CHECK (status IN ('ENROLLED', 'COMPLETED', 'DROPPED', 'WITHDRAWN')),
    final_grade VARCHAR(5),
    final_percentage DECIMAL(5,2),
    attendance_percentage DECIMAL(5,2),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(course_id, student_id)
);

-- Lectures Table (Individual class sessions)
CREATE TABLE IF NOT EXISTS lectures (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    lecture_number INTEGER,
    lecture_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_minutes INTEGER NOT NULL,
    location VARCHAR(255),
    meeting_url VARCHAR(500),
    recording_url VARCHAR(500),
    status VARCHAR(20) NOT NULL DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED', 'LIVE', 'COMPLETED', 'CANCELLED')),
    materials JSONB DEFAULT '[]', -- Array of {type, url, name}
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_lecture_times CHECK (end_time > start_time)
);

-- Lecture Attendance Table
CREATE TABLE IF NOT EXISTS lecture_attendance (
    id BIGSERIAL PRIMARY KEY,
    lecture_id BIGINT NOT NULL REFERENCES lectures(id) ON DELETE CASCADE,
    student_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'ABSENT' CHECK (status IN ('PRESENT', 'ABSENT', 'LATE', 'EXCUSED')),
    check_in_time TIMESTAMP,
    check_out_time TIMESTAMP,
    duration_minutes INTEGER,
    notes TEXT,
    marked_by BIGINT REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(lecture_id, student_id)
);

-- ============================================================================
-- ASSESSMENT TABLES
-- ============================================================================

-- Assignments Table
CREATE TABLE IF NOT EXISTS assignments (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    teacher_id BIGINT NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructions TEXT,
    due_date TIMESTAMP NOT NULL,
    max_points DECIMAL(6,2) NOT NULL CHECK (max_points >= 0),
    weight_percentage DECIMAL(5,2) DEFAULT 0 CHECK (weight_percentage >= 0 AND weight_percentage <= 100),
    assignment_type VARCHAR(20) NOT NULL DEFAULT 'HOMEWORK' CHECK (assignment_type IN ('HOMEWORK', 'QUIZ', 'EXAM', 'PROJECT', 'LAB')),
    allow_late_submission BOOLEAN DEFAULT FALSE,
    late_penalty_percentage DECIMAL(5,2) DEFAULT 0,
    file_url VARCHAR(500),
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'CLOSED')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Assignment Submissions Table
CREATE TABLE IF NOT EXISTS assignment_submissions (
    id BIGSERIAL PRIMARY KEY,
    assignment_id BIGINT NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    student_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    submission_date TIMESTAMP,
    submitted_text TEXT,
    file_urls JSONB DEFAULT '[]', -- Array of file URLs
    points_earned DECIMAL(6,2) CHECK (points_earned >= 0),
    max_points DECIMAL(6,2),
    percentage DECIMAL(5,2),
    status VARCHAR(20) NOT NULL DEFAULT 'NOT_SUBMITTED' CHECK (status IN ('NOT_SUBMITTED', 'SUBMITTED', 'GRADED', 'RETURNED', 'LATE')),
    feedback TEXT,
    graded_by BIGINT REFERENCES users(id),
    graded_at TIMESTAMP,
    attempts INTEGER DEFAULT 0,
    is_late BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(assignment_id, student_id)
);

-- Grades Table (Overall course grades)
CREATE TABLE IF NOT EXISTS grades (
    id BIGSERIAL PRIMARY KEY,
    enrollment_id BIGINT UNIQUE NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
    course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    student_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_points_earned DECIMAL(8,2) DEFAULT 0,
    total_points_possible DECIMAL(8,2) DEFAULT 0,
    percentage DECIMAL(5,2),
    letter_grade VARCHAR(5),
    gpa DECIMAL(3,2),
    midterm_grade VARCHAR(5),
    final_grade VARCHAR(5),
    comments TEXT,
    calculated_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Grade Components (breakdown of grade calculation)
CREATE TABLE IF NOT EXISTS grade_components (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    component_name VARCHAR(100) NOT NULL, -- e.g., 'Homework', 'Exams', 'Projects'
    weight_percentage DECIMAL(5,2) NOT NULL CHECK (weight_percentage >= 0 AND weight_percentage <= 100),
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- COMMUNICATION TABLES
-- ============================================================================

-- Announcements Table
CREATE TABLE IF NOT EXISTS announcements (
    id BIGSERIAL PRIMARY KEY,
    organization_id BIGINT REFERENCES organizations(id) ON DELETE CASCADE,
    author_id BIGINT NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
    target_audience VARCHAR(20) NOT NULL DEFAULT 'ALL' CHECK (target_audience IN ('ALL', 'STUDENTS', 'TEACHERS', 'PARENTS', 'ADMINS')),
    course_id BIGINT REFERENCES courses(id),
    is_published BOOLEAN DEFAULT TRUE,
    publish_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expire_date TIMESTAMP,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    related_entity_type VARCHAR(50), -- e.g., 'ASSIGNMENT', 'LECTURE', 'GRADE'
    related_entity_id BIGINT,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- DIGITAL LEARNING TABLES
-- ============================================================================

-- Digital Notebooks Table
CREATE TABLE IF NOT EXISTS digital_notebooks (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lecture_id BIGINT REFERENCES lectures(id),
    course_id BIGINT REFERENCES courses(id),
    title VARCHAR(255) NOT NULL,
    content JSONB DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    is_shared BOOLEAN DEFAULT FALSE,
    file_url VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- ANALYTICS TABLES
-- ============================================================================

-- Analytics Events Table
CREATE TABLE IF NOT EXISTS analytics_events (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    organization_id BIGINT REFERENCES organizations(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    event_category VARCHAR(50),
    event_data JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Users
CREATE INDEX IF NOT EXISTS idx_users_organization ON users(organization_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- Student/Teacher Details
CREATE INDEX IF NOT EXISTS idx_student_details_user ON student_details(user_id);
CREATE INDEX IF NOT EXISTS idx_teacher_details_user ON teacher_details(user_id);
CREATE INDEX IF NOT EXISTS idx_student_details_grade ON student_details(grade_level);

-- Subjects and Courses
CREATE INDEX IF NOT EXISTS idx_subjects_organization ON subjects(organization_id);
CREATE INDEX IF NOT EXISTS idx_subjects_code ON subjects(code);
CREATE INDEX IF NOT EXISTS idx_courses_subject ON courses(subject_id);
CREATE INDEX IF NOT EXISTS idx_courses_teacher ON courses(teacher_id);
CREATE INDEX IF NOT EXISTS idx_courses_organization ON courses(organization_id);
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_dates ON courses(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_courses_term ON courses(term, academic_year);

-- Enrollments
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_student ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON enrollments(status);

-- Lectures
CREATE INDEX IF NOT EXISTS idx_lectures_course ON lectures(course_id);
CREATE INDEX IF NOT EXISTS idx_lectures_date ON lectures(lecture_date);
CREATE INDEX IF NOT EXISTS idx_lectures_status ON lectures(status);
CREATE INDEX IF NOT EXISTS idx_lectures_course_date ON lectures(course_id, lecture_date);

-- Lecture Attendance
CREATE INDEX IF NOT EXISTS idx_lecture_attendance_lecture ON lecture_attendance(lecture_id);
CREATE INDEX IF NOT EXISTS idx_lecture_attendance_student ON lecture_attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_lecture_attendance_status ON lecture_attendance(status);

-- Assignments
CREATE INDEX IF NOT EXISTS idx_assignments_course ON assignments(course_id);
CREATE INDEX IF NOT EXISTS idx_assignments_teacher ON assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_assignments_due_date ON assignments(due_date);
CREATE INDEX IF NOT EXISTS idx_assignments_status ON assignments(status);
CREATE INDEX IF NOT EXISTS idx_assignments_type ON assignments(assignment_type);

-- Assignment Submissions
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_assignment ON assignment_submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_student ON assignment_submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_status ON assignment_submissions(status);
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_graded ON assignment_submissions(graded_by);

-- Grades
CREATE INDEX IF NOT EXISTS idx_grades_enrollment ON grades(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_grades_course ON grades(course_id);
CREATE INDEX IF NOT EXISTS idx_grades_student ON grades(student_id);

-- Grade Components
CREATE INDEX IF NOT EXISTS idx_grade_components_course ON grade_components(course_id);

-- Announcements
CREATE INDEX IF NOT EXISTS idx_announcements_organization ON announcements(organization_id);
CREATE INDEX IF NOT EXISTS idx_announcements_author ON announcements(author_id);
CREATE INDEX IF NOT EXISTS idx_announcements_course ON announcements(course_id);
CREATE INDEX IF NOT EXISTS idx_announcements_dates ON announcements(publish_date, expire_date);
CREATE INDEX IF NOT EXISTS idx_announcements_target ON announcements(target_audience);

-- Notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);

-- Digital Notebooks
CREATE INDEX IF NOT EXISTS idx_notebooks_user ON digital_notebooks(user_id);
CREATE INDEX IF NOT EXISTS idx_notebooks_lecture ON digital_notebooks(lecture_id);
CREATE INDEX IF NOT EXISTS idx_notebooks_course ON digital_notebooks(course_id);
CREATE INDEX IF NOT EXISTS idx_notebooks_tags ON digital_notebooks USING gin(tags);

-- Analytics
CREATE INDEX IF NOT EXISTS idx_analytics_user ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_organization ON analytics_events(organization_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics_events(created_at DESC);

-- ============================================================================
-- TRIGGERS FOR AUTOMATIC TIMESTAMP UPDATES
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update trigger to all relevant tables
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_details_updated_at BEFORE UPDATE ON student_details
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teacher_details_updated_at BEFORE UPDATE ON teacher_details
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON subjects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_enrollments_updated_at BEFORE UPDATE ON enrollments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lectures_updated_at BEFORE UPDATE ON lectures
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON assignments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assignment_submissions_updated_at BEFORE UPDATE ON assignment_submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_grades_updated_at BEFORE UPDATE ON grades
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_digital_notebooks_updated_at BEFORE UPDATE ON digital_notebooks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TRIGGERS FOR AUTOMATIC CALCULATIONS
-- ============================================================================

-- Auto-calculate assignment submission percentage
CREATE OR REPLACE FUNCTION calculate_submission_percentage()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.points_earned IS NOT NULL AND NEW.max_points IS NOT NULL AND NEW.max_points > 0 THEN
        NEW.percentage = ROUND((NEW.points_earned / NEW.max_points * 100)::NUMERIC, 2);
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_calculate_submission_percentage
    BEFORE INSERT OR UPDATE ON assignment_submissions
    FOR EACH ROW EXECUTE FUNCTION calculate_submission_percentage();

-- Auto-calculate overall grade percentage
CREATE OR REPLACE FUNCTION calculate_grade_percentage()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.total_points_possible IS NOT NULL AND NEW.total_points_possible > 0 THEN
        NEW.percentage = ROUND((NEW.total_points_earned / NEW.total_points_possible * 100)::NUMERIC, 2);
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_calculate_grade_percentage
    BEFORE INSERT OR UPDATE ON grades
    FOR EACH ROW EXECUTE FUNCTION calculate_grade_percentage();

-- ============================================================================
-- MATERIALIZED VIEWS FOR DASHBOARD METRICS
-- ============================================================================

-- Student Dashboard Stats
CREATE MATERIALIZED VIEW IF NOT EXISTS dashboard_student_stats AS
SELECT 
    s.user_id,
    s.first_name,
    s.last_name,
    COUNT(DISTINCT e.course_id) as enrolled_courses_count,
    COUNT(DISTINCT CASE 
        WHEN a.status = 'PUBLISHED' 
        AND a.due_date > NOW() 
        AND asub.status IN ('NOT_SUBMITTED', 'SUBMITTED') 
        THEN a.id 
    END) as assignments_due_count,
    COUNT(DISTINCT CASE 
        WHEN asub.status = 'GRADED' 
        THEN asub.id 
    END) as graded_assignments_count,
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
GROUP BY s.user_id, s.first_name, s.last_name;

CREATE UNIQUE INDEX IF NOT EXISTS idx_dashboard_student_stats_user ON dashboard_student_stats(user_id);

-- Teacher Dashboard Stats
CREATE MATERIALIZED VIEW IF NOT EXISTS dashboard_teacher_stats AS
SELECT 
    t.user_id,
    t.first_name,
    t.last_name,
    COUNT(DISTINCT c.id) as total_courses,
    COUNT(DISTINCT e.student_id) as total_students,
    COUNT(DISTINCT a.id) as total_assignments,
    COUNT(DISTINCT CASE 
        WHEN asub.status = 'SUBMITTED' 
        THEN asub.id 
    END) as pending_gradings,
    COUNT(DISTINCT l.id) as total_lectures,
    COUNT(DISTINCT CASE 
        WHEN l.status = 'SCHEDULED' 
        AND l.lecture_date >= CURRENT_DATE 
        THEN l.id 
    END) as upcoming_lectures,
    COUNT(DISTINCT CASE 
        WHEN l.lecture_date = CURRENT_DATE 
        AND l.status IN ('SCHEDULED', 'LIVE') 
        THEN l.id 
    END) as lectures_today,
    COALESCE(ROUND(AVG(CASE WHEN la.status = 'PRESENT' THEN 100 ELSE 0 END), 2), 0) as average_attendance_rate
FROM teacher_details t
LEFT JOIN courses c ON c.teacher_id = t.user_id AND c.status = 'ACTIVE'
LEFT JOIN enrollments e ON e.course_id = c.id AND e.status = 'ENROLLED'
LEFT JOIN assignments a ON a.course_id = c.id AND a.status = 'PUBLISHED'
LEFT JOIN assignment_submissions asub ON asub.assignment_id = a.id
LEFT JOIN lectures l ON l.course_id = c.id
LEFT JOIN lecture_attendance la ON la.lecture_id = l.id
GROUP BY t.user_id, t.first_name, t.last_name;

CREATE UNIQUE INDEX IF NOT EXISTS idx_dashboard_teacher_stats_user ON dashboard_teacher_stats(user_id);

-- Organization Admin Dashboard Stats
CREATE MATERIALIZED VIEW IF NOT EXISTS dashboard_org_admin_stats AS
SELECT 
    o.id as organization_id,
    o.name as organization_name,
    COUNT(DISTINCT u.id) as total_users,
    COUNT(DISTINCT CASE WHEN u.role = 'STUDENT' AND u.status = 'ACTIVE' THEN u.id END) as total_students,
    COUNT(DISTINCT CASE WHEN u.role = 'TEACHER' AND u.status = 'ACTIVE' THEN u.id END) as total_teachers,
    COUNT(DISTINCT CASE WHEN u.role = 'ORGADMIN' AND u.status = 'ACTIVE' THEN u.id END) as total_admins,
    COUNT(DISTINCT c.id) as total_courses,
    COUNT(DISTINCT CASE WHEN c.status = 'ACTIVE' THEN c.id END) as active_courses,
    COUNT(DISTINCT l.id) as total_lectures,
    COUNT(DISTINCT CASE WHEN l.status = 'LIVE' THEN l.id END) as live_lectures,
    COUNT(DISTINCT CASE WHEN l.lecture_date = CURRENT_DATE AND l.status IN ('SCHEDULED', 'LIVE') THEN l.id END) as lectures_today,
    COUNT(DISTINCT a.id) as total_assignments,
    COALESCE(ROUND(AVG(CASE WHEN la.status = 'PRESENT' THEN 100 ELSE 0 END), 2), 0) as overall_attendance_rate,
    COUNT(DISTINCT e.id) as total_enrollments
FROM organizations o
LEFT JOIN users u ON u.organization_id = o.id
LEFT JOIN courses c ON c.organization_id = o.id
LEFT JOIN lectures l ON l.course_id = c.id
LEFT JOIN assignments a ON a.course_id = c.id
LEFT JOIN lecture_attendance la ON la.lecture_id = l.id
LEFT JOIN enrollments e ON e.course_id = c.id AND e.status = 'ENROLLED'
WHERE o.is_active = TRUE
GROUP BY o.id, o.name;

CREATE UNIQUE INDEX IF NOT EXISTS idx_dashboard_org_admin_stats_org ON dashboard_org_admin_stats(organization_id);

-- ============================================================================
-- FUNCTIONS FOR COMMON OPERATIONS
-- ============================================================================

-- Function to get student count for an organization
CREATE OR REPLACE FUNCTION get_student_count(org_id BIGINT DEFAULT NULL)
RETURNS BIGINT AS $$
BEGIN
    IF org_id IS NULL THEN
        RETURN (SELECT COUNT(*) FROM users WHERE role = 'STUDENT' AND status = 'ACTIVE');
    ELSE
        RETURN (SELECT COUNT(*) FROM users WHERE role = 'STUDENT' AND status = 'ACTIVE' AND organization_id = org_id);
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate attendance percentage for a student
CREATE OR REPLACE FUNCTION calculate_student_attendance(student_user_id BIGINT, course_id_param BIGINT DEFAULT NULL)
RETURNS DECIMAL AS $$
DECLARE
    total_lectures INTEGER;
    attended_lectures INTEGER;
BEGIN
    IF course_id_param IS NULL THEN
        -- Overall attendance across all courses
        SELECT COUNT(*) INTO total_lectures
        FROM lecture_attendance
        WHERE student_id = student_user_id;
        
        SELECT COUNT(*) INTO attended_lectures
        FROM lecture_attendance
        WHERE student_id = student_user_id AND status = 'PRESENT';
    ELSE
        -- Course-specific attendance
        SELECT COUNT(*) INTO total_lectures
        FROM lecture_attendance la
        JOIN lectures l ON la.lecture_id = l.id
        WHERE la.student_id = student_user_id AND l.course_id = course_id_param;
        
        SELECT COUNT(*) INTO attended_lectures
        FROM lecture_attendance la
        JOIN lectures l ON la.lecture_id = l.id
        WHERE la.student_id = student_user_id AND l.course_id = course_id_param AND la.status = 'PRESENT';
    END IF;
    
    IF total_lectures = 0 THEN
        RETURN 0;
    END IF;
    
    RETURN ROUND((attended_lectures::DECIMAL / total_lectures * 100), 2);
END;
$$ LANGUAGE plpgsql;

-- Function to refresh all dashboard views
CREATE OR REPLACE FUNCTION refresh_dashboard_views()
RETURNS VOID AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY dashboard_student_stats;
    REFRESH MATERIALIZED VIEW CONCURRENTLY dashboard_teacher_stats;
    REFRESH MATERIALIZED VIEW CONCURRENTLY dashboard_org_admin_stats;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================

-- Add comments to tables for documentation
COMMENT ON TABLE organizations IS 'Multi-tenant organizations';
COMMENT ON TABLE users IS 'Central user authentication table for all roles';
COMMENT ON TABLE student_details IS 'Extended profile information for students';
COMMENT ON TABLE teacher_details IS 'Extended profile information for teachers';
COMMENT ON TABLE subjects IS 'Academic subjects catalog';
COMMENT ON TABLE courses IS 'Course instances with specific terms and schedules';
COMMENT ON TABLE enrollments IS 'Student enrollments in courses';
COMMENT ON TABLE lectures IS 'Individual lecture/class sessions';
COMMENT ON TABLE lecture_attendance IS 'Attendance tracking for lectures';
COMMENT ON TABLE assignments IS 'Course assignments and assessments';
COMMENT ON TABLE assignment_submissions IS 'Student assignment submissions and grades';
COMMENT ON TABLE grades IS 'Overall course grades for students';
COMMENT ON TABLE grade_components IS 'Grade calculation components and weights';
COMMENT ON TABLE announcements IS 'System-wide announcements';
COMMENT ON TABLE notifications IS 'User-specific notifications';
COMMENT ON TABLE digital_notebooks IS 'Digital note-taking (Huion Note X10)';
COMMENT ON TABLE analytics_events IS 'User activity tracking for analytics';
