-- Test Data for NXT Class Database
-- This file contains comprehensive test data for all tables

-- Clear existing data (in order due to foreign key constraints)
DELETE FROM analytics_events;
DELETE FROM assignment_submissions;
DELETE FROM class_participants;
DELETE FROM announcements;
DELETE FROM assignments;
DELETE FROM class_sessions;
DELETE FROM digital_notebooks;
DELETE FROM users;
DELETE FROM subjects;
DELETE FROM organizations;

-- Reset sequences
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE organizations_id_seq RESTART WITH 1;
ALTER SEQUENCE subjects_id_seq RESTART WITH 1;
ALTER SEQUENCE class_sessions_id_seq RESTART WITH 1;
ALTER SEQUENCE assignments_id_seq RESTART WITH 1;
ALTER SEQUENCE announcements_id_seq RESTART WITH 1;
ALTER SEQUENCE digital_notebooks_id_seq RESTART WITH 1;
ALTER SEQUENCE analytics_events_id_seq RESTART WITH 1;

-- Insert organizations
INSERT INTO organizations (name, domain, settings) VALUES 
('Sunrise Academy', 'sunrise.edu', '{"theme": "blue", "features": ["virtual_classroom", "digital_notebook", "analytics"]}'),
('Tech Institute', 'tech.edu', '{"theme": "green", "features": ["virtual_classroom", "analytics"]}'),
('Global University', 'global.edu', '{"theme": "purple", "features": ["virtual_classroom", "digital_notebook", "analytics", "ai_tutoring"]}');

-- Insert subjects
INSERT INTO subjects (name, description, organization_id) VALUES 
-- Sunrise Academy subjects
('Mathematics', 'Advanced mathematics including calculus, algebra, and statistics', 1),
('Physics', 'Physics with laboratory work and practical applications', 1),
('History', 'World history and social studies', 1),
('Chemistry', 'Chemistry with laboratory experiments', 1),
('English Literature', 'English literature and composition', 1),
('Biology', 'Biology with laboratory work', 1),
-- Tech Institute subjects
('Computer Science', 'Programming, algorithms, and software development', 2),
('Data Science', 'Data analysis, machine learning, and statistics', 2),
('Cybersecurity', 'Information security and ethical hacking', 2),
('Web Development', 'Frontend and backend web development', 2),
-- Global University subjects
('Business Administration', 'Business management and entrepreneurship', 3),
('Psychology', 'Psychology and human behavior', 3),
('Environmental Science', 'Environmental studies and sustainability', 3);

-- Insert users with different roles and organizations
INSERT INTO users (name, email, password, role, status, organization, avatar_url) VALUES 
-- Sunrise Academy users
('John Admin', 'admin@sunrise.edu', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'ORGADMIN', 'ACTIVE', 'Sunrise Academy', 'https://example.com/avatars/admin.jpg'),
('Sarah Johnson', 'sarah.j@sunrise.edu', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'TEACHER', 'ACTIVE', 'Sunrise Academy', 'https://example.com/avatars/sarah.jpg'),
('Michael Chen', 'michael.c@sunrise.edu', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'TEACHER', 'ACTIVE', 'Sunrise Academy', 'https://example.com/avatars/michael.jpg'),
('Dr. Emily Rodriguez', 'emily.r@sunrise.edu', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'TEACHER', 'ACTIVE', 'Sunrise Academy', 'https://example.com/avatars/emily.jpg'),
('Emily Davis', 'emily.d@students.sunrise.edu', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'STUDENT', 'ACTIVE', 'Sunrise Academy', 'https://example.com/avatars/emily_student.jpg'),
('James Wilson', 'james.w@students.sunrise.edu', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'STUDENT', 'ACTIVE', 'Sunrise Academy', 'https://example.com/avatars/james.jpg'),
('Lisa Anderson', 'lisa.a@students.sunrise.edu', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'STUDENT', 'INACTIVE', 'Sunrise Academy', 'https://example.com/avatars/lisa.jpg'),
('Alex Thompson', 'alex.t@students.sunrise.edu', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'STUDENT', 'ACTIVE', 'Sunrise Academy', 'https://example.com/avatars/alex.jpg'),
-- Tech Institute users
('Prof. David Kim', 'david.k@tech.edu', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'TEACHER', 'ACTIVE', 'Tech Institute', 'https://example.com/avatars/david.jpg'),
('Maria Garcia', 'maria.g@students.tech.edu', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'STUDENT', 'ACTIVE', 'Tech Institute', 'https://example.com/avatars/maria.jpg'),
('Tom Brown', 'tom.b@students.tech.edu', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'STUDENT', 'ACTIVE', 'Tech Institute', 'https://example.com/avatars/tom.jpg');

-- Insert class sessions with various statuses and dates
INSERT INTO class_sessions (title, teacher_id, subject_id, subject_name, date, time, duration, participants, status, meeting_url, description) VALUES 
-- Live classes (today)
('Advanced Mathematics', 2, 1, 'Mathematics', CURRENT_DATE, '10:00:00', 60, 24, 'LIVE', 'https://meet.sunrise.edu/math-101', 'Calculus and advanced algebra concepts'),
('Physics Laboratory', 3, 2, 'Physics', CURRENT_DATE, '14:00:00', 90, 18, 'LIVE', 'https://meet.sunrise.edu/physics-lab', 'Hands-on physics experiments'),
-- Upcoming classes (next few days)
('Introduction to Physics', 3, 2, 'Physics', CURRENT_DATE + INTERVAL '1 day', '14:00:00', 90, 18, 'UPCOMING', 'https://meet.sunrise.edu/physics-101', 'Basic physics principles and laws'),
('World History', 2, 3, 'History', CURRENT_DATE + INTERVAL '2 days', '11:00:00', 60, 22, 'UPCOMING', 'https://meet.sunrise.edu/history-201', 'World War I and its consequences'),
('Chemistry Lab', 4, 4, 'Chemistry', CURRENT_DATE + INTERVAL '3 days', '09:00:00', 120, 16, 'UPCOMING', 'https://meet.sunrise.edu/chem-lab', 'Chemical reactions and analysis'),
('English Literature', 2, 5, 'English Literature', CURRENT_DATE + INTERVAL '4 days', '13:00:00', 75, 20, 'UPCOMING', 'https://meet.sunrise.edu/english-301', 'Shakespeare and modern literature'),
-- Completed classes (past)
('Biology Basics', 4, 6, 'Biology', CURRENT_DATE - INTERVAL '1 day', '11:00:00', 60, 22, 'COMPLETED', 'https://meet.sunrise.edu/bio-101', 'Introduction to cell biology'),
('Data Structures', 9, 7, 'Computer Science', CURRENT_DATE - INTERVAL '2 days', '15:00:00', 90, 25, 'COMPLETED', 'https://meet.tech.edu/cs-201', 'Arrays, linked lists, and trees'),
('Business Ethics', 9, 11, 'Business Administration', CURRENT_DATE - INTERVAL '3 days', '10:00:00', 60, 30, 'COMPLETED', 'https://meet.global.edu/bus-301', 'Ethical decision making in business');

-- Insert class participants
INSERT INTO class_participants (class_session_id, student_id, attendance_status) VALUES 
-- Live classes participants
(1, 5, 'PRESENT'), (1, 6, 'PRESENT'), (1, 8, 'PRESENT'),
(2, 5, 'PRESENT'), (2, 6, 'LATE'), (2, 8, 'PRESENT'),
-- Upcoming classes participants
(3, 5, 'PRESENT'), (3, 6, 'PRESENT'), (3, 8, 'PRESENT'),
(4, 5, 'PRESENT'), (4, 6, 'PRESENT'), (4, 8, 'PRESENT'),
(5, 5, 'PRESENT'), (5, 6, 'PRESENT'), (5, 8, 'PRESENT'),
(6, 5, 'PRESENT'), (6, 6, 'PRESENT'), (6, 8, 'PRESENT'),
-- Completed classes participants
(7, 5, 'PRESENT'), (7, 6, 'ABSENT'), (7, 8, 'PRESENT'),
(8, 10, 'PRESENT'), (8, 11, 'PRESENT'),
(9, 10, 'PRESENT'), (9, 11, 'PRESENT');

-- Insert assignments with various statuses and due dates
INSERT INTO assignments (title, description, teacher_id, subject_id, subject_name, due_date, total_points, status) VALUES 
-- Pending assignments
('Calculus Problem Set', 'Complete problems 1-20 from chapter 5. Show all work and explain your reasoning.', 2, 1, 'Mathematics', CURRENT_DATE + INTERVAL '5 days', 100, 'PENDING'),
('Physics Lab Report', 'Write a comprehensive lab report on the pendulum experiment. Include data analysis and conclusions.', 3, 2, 'Physics', CURRENT_DATE + INTERVAL '3 days', 50, 'PENDING'),
('Chemistry Worksheet', 'Complete the periodic table worksheet and answer questions 1-15.', 4, 4, 'Chemistry', CURRENT_DATE + INTERVAL '7 days', 75, 'PENDING'),
('History Essay', 'Write a 1000-word essay on the causes of World War I. Use at least 3 sources.', 2, 3, 'History', CURRENT_DATE + INTERVAL '10 days', 100, 'PENDING'),
('English Literature Analysis', 'Analyze the themes in Shakespeare''s Hamlet. 800 words minimum.', 2, 5, 'English Literature', CURRENT_DATE + INTERVAL '6 days', 80, 'PENDING'),
-- Submitted assignments
('Biology Research Paper', 'Research paper on climate change effects on ecosystems.', 4, 6, 'Biology', CURRENT_DATE - INTERVAL '2 days', 120, 'SUBMITTED'),
('Data Structures Project', 'Implement a binary search tree with insertion, deletion, and search operations.', 9, 7, 'Computer Science', CURRENT_DATE - INTERVAL '1 day', 150, 'SUBMITTED'),
-- Graded assignments
('Mathematics Quiz', 'Quiz on derivatives and integrals.', 2, 1, 'Mathematics', CURRENT_DATE - INTERVAL '5 days', 50, 'GRADED'),
('Physics Homework', 'Homework problems on Newton''s laws of motion.', 3, 2, 'Physics', CURRENT_DATE - INTERVAL '7 days', 40, 'GRADED'),
('Business Case Study', 'Case study analysis of a successful startup company.', 9, 11, 'Business Administration', CURRENT_DATE - INTERVAL '10 days', 90, 'GRADED');

-- Insert assignment submissions
INSERT INTO assignment_submissions (assignment_id, student_id, grade, feedback, status) VALUES 
-- Biology research paper submissions
(6, 5, 85, 'Good research but needs more specific examples. Well-written conclusion.', 'GRADED'),
(6, 6, 92, 'Excellent work! Great use of sources and clear analysis.', 'GRADED'),
-- Data structures project submissions
(7, 10, 88, 'Good implementation. Consider adding more error handling.', 'GRADED'),
(7, 11, 95, 'Outstanding work! Clean code and excellent documentation.', 'GRADED'),
-- Mathematics quiz submissions
(8, 5, 42, 'Review derivative rules and practice more problems.', 'GRADED'),
(8, 6, 48, 'Good work! Minor calculation errors.', 'GRADED'),
-- Physics homework submissions
(9, 5, 38, 'Good understanding of concepts. Check your calculations.', 'GRADED'),
(9, 6, 40, 'Perfect! Excellent problem-solving approach.', 'GRADED'),
-- Business case study submissions
(10, 10, 87, 'Good analysis. Consider the competitive landscape more deeply.', 'GRADED'),
(10, 11, 90, 'Excellent strategic thinking and analysis.', 'GRADED');

-- Insert announcements with different priorities and dates
INSERT INTO announcements (title, content, author_id, priority, date, organization_id, is_global) VALUES 
-- High priority announcements
('School Closed Next Monday', 'The school will be closed next Monday for staff development day. All classes are cancelled and assignments due dates will be extended by one day.', 1, 'HIGH', CURRENT_DATE - INTERVAL '3 days', 1, TRUE),
('System Maintenance', 'The platform will be under maintenance this Sunday from 2 AM to 6 AM. Please save your work before this time.', 1, 'HIGH', CURRENT_DATE - INTERVAL '1 day', 1, TRUE),
-- Medium priority announcements
('New Digital Notebook Feature', 'We have integrated Huion Note X10 support for enhanced digital note-taking. Teachers can now use this feature in their virtual classrooms. Contact IT support for setup assistance.', 2, 'MEDIUM', CURRENT_DATE - INTERVAL '4 days', 1, TRUE),
('Parent-Teacher Conferences', 'Parent-teacher conferences will be held from October 25-27. Please schedule your appointments through the school portal. Slots are filling up quickly!', 1, 'MEDIUM', CURRENT_DATE - INTERVAL '5 days', 1, TRUE),
('Library Hours Extended', 'The digital library will now be available 24/7. Access thousands of e-books, journals, and research papers.', 1, 'MEDIUM', CURRENT_DATE - INTERVAL '2 days', 1, TRUE),
-- Low priority announcements
('New Student Orientation', 'Welcome new students! Join us for a virtual orientation session this Friday at 3 PM. Link will be sent via email.', 1, 'LOW', CURRENT_DATE - INTERVAL '6 days', 1, FALSE),
('Tech Institute: Coding Bootcamp', 'Intensive 12-week coding bootcamp starting next month. Limited seats available. Contact admissions for more information.', 9, 'LOW', CURRENT_DATE - INTERVAL '7 days', 2, FALSE);

-- Insert digital notebooks
INSERT INTO digital_notebooks (user_id, class_session_id, title, content) VALUES 
(5, 1, 'Calculus Notes - Derivatives', '{"pages": [{"content": "Derivative rules: d/dx(x^n) = nx^(n-1)", "timestamp": "2024-01-15T10:30:00Z"}]}'),
(5, 2, 'Physics Lab - Pendulum Experiment', '{"pages": [{"content": "Pendulum period formula: T = 2π√(L/g)", "timestamp": "2024-01-15T14:15:00Z"}]}'),
(6, 1, 'Math Problem Solutions', '{"pages": [{"content": "Problem 1: Find derivative of f(x) = x^3 + 2x^2", "timestamp": "2024-01-15T10:45:00Z"}]}'),
(10, 8, 'Data Structures - Binary Trees', '{"pages": [{"content": "Binary tree traversal methods: inorder, preorder, postorder", "timestamp": "2024-01-13T15:20:00Z"}]}');

-- Insert analytics events
INSERT INTO analytics_events (user_id, event_type, event_data, organization_id) VALUES 
-- Login events
(5, 'LOGIN', '{"ip": "192.168.1.1", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", "timestamp": "2024-01-15T09:30:00Z"}', 1),
(6, 'LOGIN', '{"ip": "192.168.1.2", "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36", "timestamp": "2024-01-15T09:45:00Z"}', 1),
(10, 'LOGIN', '{"ip": "192.168.2.1", "user_agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36", "timestamp": "2024-01-15T10:00:00Z"}', 2),
-- Class events
(5, 'CLASS_JOIN', '{"class_id": 1, "class_title": "Advanced Mathematics", "timestamp": "2024-01-15T10:00:00Z"}', 1),
(5, 'CLASS_JOIN', '{"class_id": 2, "class_title": "Physics Laboratory", "timestamp": "2024-01-15T14:00:00Z"}', 1),
(6, 'CLASS_JOIN', '{"class_id": 1, "class_title": "Advanced Mathematics", "timestamp": "2024-01-15T10:05:00Z"}', 1),
-- Assignment events
(5, 'ASSIGNMENT_SUBMIT', '{"assignment_id": 6, "assignment_title": "Biology Research Paper", "timestamp": "2024-01-13T16:30:00Z"}', 1),
(6, 'ASSIGNMENT_SUBMIT', '{"assignment_id": 6, "assignment_title": "Biology Research Paper", "timestamp": "2024-01-13T17:00:00Z"}', 1),
(10, 'ASSIGNMENT_SUBMIT', '{"assignment_id": 7, "assignment_title": "Data Structures Project", "timestamp": "2024-01-14T20:00:00Z"}', 2),
-- Notebook events
(5, 'NOTEBOOK_CREATE', '{"notebook_id": 1, "title": "Calculus Notes - Derivatives", "timestamp": "2024-01-15T10:30:00Z"}', 1),
(5, 'NOTEBOOK_UPDATE', '{"notebook_id": 1, "pages_added": 1, "timestamp": "2024-01-15T10:35:00Z"}', 1),
-- System events
(1, 'ANNOUNCEMENT_CREATE', '{"announcement_id": 1, "title": "School Closed Next Monday", "priority": "HIGH", "timestamp": "2024-01-12T08:00:00Z"}', 1),
(2, 'ANNOUNCEMENT_CREATE', '{"announcement_id": 3, "title": "New Digital Notebook Feature", "priority": "MEDIUM", "timestamp": "2024-01-11T14:30:00Z"}', 1);

-- Update class session participants count
UPDATE class_sessions SET participants = (
    SELECT COUNT(*) FROM class_participants 
    WHERE class_session_id = class_sessions.id
);

-- Create some additional test scenarios
-- Add more students to some classes
INSERT INTO class_participants (class_session_id, student_id, attendance_status) VALUES 
(1, 7, 'PRESENT'), -- Lisa joins math class
(3, 7, 'PRESENT'), -- Lisa joins upcoming physics class
(4, 7, 'PRESENT'); -- Lisa joins history class

-- Add some late submissions
INSERT INTO assignment_submissions (assignment_id, student_id, submitted_at, status) VALUES 
(1, 5, CURRENT_DATE + INTERVAL '4 days', 'SUBMITTED'), -- Early submission
(2, 6, CURRENT_DATE + INTERVAL '2 days', 'SUBMITTED'), -- On time submission
(3, 5, CURRENT_DATE + INTERVAL '6 days', 'SUBMITTED'); -- Early submission

-- Add some analytics for the new data
INSERT INTO analytics_events (user_id, event_type, event_data, organization_id) VALUES 
(7, 'LOGIN', '{"ip": "192.168.1.3", "user_agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)", "timestamp": "2024-01-15T11:00:00Z"}', 1),
(7, 'CLASS_JOIN', '{"class_id": 1, "class_title": "Advanced Mathematics", "timestamp": "2024-01-15T11:05:00Z"}', 1),
(5, 'ASSIGNMENT_SUBMIT', '{"assignment_id": 1, "assignment_title": "Calculus Problem Set", "timestamp": "2024-01-19T15:30:00Z"}', 1),
(6, 'ASSIGNMENT_SUBMIT', '{"assignment_id": 2, "assignment_title": "Physics Lab Report", "timestamp": "2024-01-17T16:45:00Z"}', 1);