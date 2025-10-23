-- NXT Class Database Schema
-- This file contains the complete database schema for the NXT Class educational platform

-- Create database (for PostgreSQL)
-- CREATE DATABASE nxtclass;
-- \c nxtclass;

-- Users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('ORGADMIN', 'TEACHER', 'STUDENT')),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    avatar_url VARCHAR(500),
    organization VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Organizations table (for multi-tenant support)
CREATE TABLE organizations (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE,
    settings JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Subjects table
CREATE TABLE subjects (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    organization_id BIGINT REFERENCES organizations(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Class sessions table
CREATE TABLE class_sessions (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    teacher_id BIGINT NOT NULL REFERENCES users(id),
    subject_id BIGINT REFERENCES subjects(id),
    subject_name VARCHAR(255) NOT NULL, -- Denormalized for performance
    date DATE NOT NULL,
    time TIME NOT NULL,
    duration INTEGER NOT NULL CHECK (duration > 0),
    participants INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'UPCOMING' CHECK (status IN ('UPCOMING', 'LIVE', 'COMPLETED')),
    meeting_url VARCHAR(500),
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Class participants (many-to-many relationship)
CREATE TABLE class_participants (
    id BIGSERIAL PRIMARY KEY,
    class_session_id BIGINT NOT NULL REFERENCES class_sessions(id) ON DELETE CASCADE,
    student_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    attendance_status VARCHAR(20) DEFAULT 'PRESENT' CHECK (attendance_status IN ('PRESENT', 'ABSENT', 'LATE')),
    UNIQUE(class_session_id, student_id)
);

-- Assignments table
CREATE TABLE assignments (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    teacher_id BIGINT NOT NULL REFERENCES users(id),
    subject_id BIGINT REFERENCES subjects(id),
    subject_name VARCHAR(255) NOT NULL, -- Denormalized for performance
    due_date DATE NOT NULL,
    total_points INTEGER NOT NULL CHECK (total_points >= 0),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SUBMITTED', 'GRADED')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Assignment submissions
CREATE TABLE assignment_submissions (
    id BIGSERIAL PRIMARY KEY,
    assignment_id BIGINT NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    student_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    grade INTEGER CHECK (grade >= 0),
    feedback TEXT,
    file_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'SUBMITTED' CHECK (status IN ('SUBMITTED', 'GRADED', 'RETURNED')),
    UNIQUE(assignment_id, student_id)
);

-- Announcements table
CREATE TABLE announcements (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id BIGINT NOT NULL REFERENCES users(id),
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH')),
    date DATE NOT NULL,
    organization_id BIGINT REFERENCES organizations(id),
    is_global BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Digital notebooks table
CREATE TABLE digital_notebooks (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    class_session_id BIGINT REFERENCES class_sessions(id),
    title VARCHAR(255) NOT NULL,
    content JSONB, -- Store notebook content as JSON
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Analytics and statistics table
CREATE TABLE analytics_events (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    organization_id BIGINT REFERENCES organizations(id)
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_organization ON users(organization);
CREATE INDEX idx_class_sessions_teacher ON class_sessions(teacher_id);
CREATE INDEX idx_class_sessions_date ON class_sessions(date);
CREATE INDEX idx_class_sessions_status ON class_sessions(status);
CREATE INDEX idx_assignments_teacher ON assignments(teacher_id);
CREATE INDEX idx_assignments_due_date ON assignments(due_date);
CREATE INDEX idx_assignments_status ON assignments(status);
CREATE INDEX idx_announcements_author ON announcements(author_id);
CREATE INDEX idx_announcements_date ON announcements(date);
CREATE INDEX idx_announcements_priority ON announcements(priority);
CREATE INDEX idx_class_participants_class ON class_participants(class_session_id);
CREATE INDEX idx_class_participants_student ON class_participants(student_id);
CREATE INDEX idx_assignment_submissions_assignment ON assignment_submissions(assignment_id);
CREATE INDEX idx_assignment_submissions_student ON assignment_submissions(student_id);
CREATE INDEX idx_analytics_events_user ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_timestamp ON analytics_events(timestamp);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_class_sessions_updated_at BEFORE UPDATE ON class_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON assignments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_digital_notebooks_updated_at BEFORE UPDATE ON digital_notebooks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO organizations (name, domain) VALUES 
('Sunrise Academy', 'sunrise.edu'),
('Tech Institute', 'tech.edu');

INSERT INTO subjects (name, description, organization_id) VALUES 
('Mathematics', 'Advanced mathematics and calculus', 1),
('Physics', 'Physics and laboratory work', 1),
('History', 'World history and social studies', 1),
('Chemistry', 'Chemistry and laboratory work', 1),
('Computer Science', 'Programming and software development', 2);

-- Insert sample users
INSERT INTO users (name, email, password, role, status, organization) VALUES 
('John Admin', 'admin@sunrise.edu', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'ORGADMIN', 'ACTIVE', 'Sunrise Academy'),
('Sarah Johnson', 'sarah.j@sunrise.edu', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'TEACHER', 'ACTIVE', 'Sunrise Academy'),
('Michael Chen', 'michael.c@sunrise.edu', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'TEACHER', 'ACTIVE', 'Sunrise Academy'),
('Emily Davis', 'emily.d@students.sunrise.edu', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'STUDENT', 'ACTIVE', 'Sunrise Academy'),
('James Wilson', 'james.w@students.sunrise.edu', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'STUDENT', 'ACTIVE', 'Sunrise Academy'),
('Lisa Anderson', 'lisa.a@students.sunrise.edu', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'STUDENT', 'INACTIVE', 'Sunrise Academy');

-- Insert sample class sessions
INSERT INTO class_sessions (title, teacher_id, subject_id, subject_name, date, time, duration, participants, status) VALUES 
('Advanced Mathematics', 2, 1, 'Mathematics', CURRENT_DATE, '10:00:00', 60, 24, 'LIVE'),
('Introduction to Physics', 3, 2, 'Physics', CURRENT_DATE + INTERVAL '1 day', '14:00:00', 90, 18, 'UPCOMING'),
('World History', 2, 3, 'History', CURRENT_DATE - INTERVAL '1 day', '11:00:00', 60, 22, 'COMPLETED');

-- Insert sample assignments
INSERT INTO assignments (title, description, teacher_id, subject_id, subject_name, due_date, total_points, status) VALUES 
('Calculus Problem Set', 'Complete problems 1-20 from chapter 5', 2, 1, 'Mathematics', CURRENT_DATE + INTERVAL '5 days', 100, 'PENDING'),
('Physics Lab Report', 'Write a lab report on the pendulum experiment', 3, 2, 'Physics', CURRENT_DATE + INTERVAL '3 days', 50, 'SUBMITTED'),
('History Essay', 'Write an essay on the causes of World War I', 2, 3, 'History', CURRENT_DATE - INTERVAL '5 days', 100, 'GRADED'),
('Chemistry Worksheet', 'Complete the periodic table worksheet', 3, 4, 'Chemistry', CURRENT_DATE + INTERVAL '7 days', 75, 'PENDING');

-- Insert sample announcements
INSERT INTO announcements (title, content, author_id, priority, date, organization_id, is_global) VALUES 
('School Closed Next Monday', 'The school will be closed next Monday for staff development day. All classes are cancelled.', 1, 'HIGH', CURRENT_DATE - INTERVAL '3 days', 1, TRUE),
('New Digital Notebook Feature', 'We have integrated Huion Note X10 support for enhanced digital note-taking.', 2, 'MEDIUM', CURRENT_DATE - INTERVAL '4 days', 1, TRUE),
('Parent-Teacher Conferences', 'Parent-teacher conferences will be held from October 25-27.', 1, 'MEDIUM', CURRENT_DATE - INTERVAL '5 days', 1, TRUE);

-- Insert class participants
INSERT INTO class_participants (class_session_id, student_id, attendance_status) VALUES 
(1, 4, 'PRESENT'),
(1, 5, 'PRESENT'),
(2, 4, 'PRESENT'),
(2, 5, 'ABSENT'),
(3, 4, 'PRESENT'),
(3, 5, 'PRESENT');

-- Insert assignment submissions
INSERT INTO assignment_submissions (assignment_id, student_id, grade, status) VALUES 
(2, 4, 85, 'GRADED'),
(2, 5, 92, 'GRADED'),
(3, 4, 88, 'GRADED'),
(3, 5, 95, 'GRADED');

-- Insert sample analytics events
INSERT INTO analytics_events (user_id, event_type, event_data, organization_id) VALUES 
(4, 'LOGIN', '{"ip": "192.168.1.1", "user_agent": "Mozilla/5.0"}', 1),
(4, 'CLASS_JOIN', '{"class_id": 1, "class_title": "Advanced Mathematics"}', 1),
(5, 'LOGIN', '{"ip": "192.168.1.2", "user_agent": "Mozilla/5.0"}', 1),
(5, 'ASSIGNMENT_SUBMIT', '{"assignment_id": 2, "assignment_title": "Physics Lab Report"}', 1);