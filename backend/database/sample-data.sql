-- ============================================================================
-- NXT Class - Sample Data for Testing
-- Description: Comprehensive sample data for dashboard testing
-- ============================================================================

-- Clear existing data (be careful in production!)
TRUNCATE TABLE analytics_events, digital_notebooks, notifications, announcements,
               grade_components, grades, assignment_submissions, assignments,
               lecture_attendance, lectures, enrollments, courses, subjects,
               teacher_details, student_details, users, organizations
RESTART IDENTITY CASCADE;

-- ============================================================================
-- ORGANIZATIONS
-- ============================================================================
INSERT INTO organizations (name, domain, settings, is_active) VALUES
('Sunrise Academy', 'sunrise.edu', '{"theme": "light", "timezone": "Asia/Kolkata"}', TRUE),
('Tech Institute', 'tech.edu', '{"theme": "dark", "timezone": "Asia/Kolkata"}', TRUE),
('Green Valley School', 'greenvalley.edu', '{"theme": "light", "timezone": "Asia/Kolkata"}', TRUE);

-- ============================================================================
-- USERS
-- ============================================================================
-- Password: 'password123' (hashed with BCrypt)
-- $2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi

-- Org Admins
INSERT INTO users (organization_id, name, email, password, role, status, phone) VALUES
(1, 'John Admin', 'admin@sunrise.edu', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'ORGADMIN', 'ACTIVE', '+91-9876543210'),
(2, 'Alice Director', 'alice@tech.edu', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'ORGADMIN', 'ACTIVE', '+91-9876543211'),
(3, 'Bob Principal', 'bob@greenvalley.edu', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'ORGADMIN', 'ACTIVE', '+91-9876543212');

-- Teachers
INSERT INTO users (organization_id, name, email, password, role, status, phone) VALUES
(1, 'Sarah Johnson', 'sarah.j@sunrise.edu', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'TEACHER', 'ACTIVE', '+91-9876543220'),
(1, 'Michael Chen', 'michael.c@sunrise.edu', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'TEACHER', 'ACTIVE', '+91-9876543221'),
(1, 'David Williams', 'david.w@sunrise.edu', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'TEACHER', 'ACTIVE', '+91-9876543222'),
(2, 'Emma Thompson', 'emma.t@tech.edu', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'TEACHER', 'ACTIVE', '+91-9876543223'),
(2, 'Robert Brown', 'robert.b@tech.edu', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'TEACHER', 'ACTIVE', '+91-9876543224');

-- Students
INSERT INTO users (organization_id, name, email, password, role, status, phone) VALUES
(1, 'Emily Davis', 'emily.d@students.sunrise.edu', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'STUDENT', 'ACTIVE', '+91-9876543300'),
(1, 'James Wilson', 'james.w@students.sunrise.edu', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'STUDENT', 'ACTIVE', '+91-9876543301'),
(1, 'Lisa Anderson', 'lisa.a@students.sunrise.edu', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'STUDENT', 'ACTIVE', '+91-9876543302'),
(1, 'Ryan Martinez', 'ryan.m@students.sunrise.edu', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'STUDENT', 'ACTIVE', '+91-9876543303'),
(1, 'Sophia Taylor', 'sophia.t@students.sunrise.edu', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'STUDENT', 'ACTIVE', '+91-9876543304'),
(1, 'Daniel Garcia', 'daniel.g@students.sunrise.edu', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'STUDENT', 'ACTIVE', '+91-9876543305'),
(1, 'Olivia Brown', 'olivia.b@students.sunrise.edu', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'STUDENT', 'ACTIVE', '+91-9876543306'),
(1, 'Ethan Jones', 'ethan.j@students.sunrise.edu', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'STUDENT', 'ACTIVE', '+91-9876543307'),
(2, 'Mia Rodriguez', 'mia.r@students.tech.edu', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'STUDENT', 'ACTIVE', '+91-9876543308'),
(2, 'Noah White', 'noah.w@students.tech.edu', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'STUDENT', 'ACTIVE', '+91-9876543309');

-- ============================================================================
-- TEACHER DETAILS
-- ============================================================================
INSERT INTO teacher_details (user_id, first_name, last_name, qualification, specialization, experience_years, joining_date, employee_id, phone, department, designation) VALUES
(4, 'Sarah', 'Johnson', 'M.Sc. Mathematics', 'Advanced Mathematics', 8, '2018-08-01', 'EMP001', '+91-9876543220', 'Mathematics', 'Senior Teacher'),
(5, 'Michael', 'Chen', 'M.Sc. Physics', 'Quantum Physics', 6, '2019-07-15', 'EMP002', '+91-9876543221', 'Science', 'Teacher'),
(6, 'David', 'Williams', 'M.A. History', 'World History', 10, '2016-06-01', 'EMP003', '+91-9876543222', 'Humanities', 'Head of Department'),
(7, 'Emma', 'Thompson', 'M.Tech. Computer Science', 'Software Engineering', 5, '2020-08-01', 'EMP004', '+91-9876543223', 'Computer Science', 'Teacher'),
(8, 'Robert', 'Brown', 'Ph.D. Chemistry', 'Organic Chemistry', 12, '2014-07-01', 'EMP005', '+91-9876543224', 'Science', 'Professor');

-- ============================================================================
-- STUDENT DETAILS
-- ============================================================================
INSERT INTO student_details (user_id, first_name, last_name, date_of_birth, guardian_name, guardian_phone, guardian_email, address_line1, city, state, country, pincode, aadhar_number, admission_date, grade_level) VALUES
(9, 'Emily', 'Davis', '2008-03-15', 'John Davis', '+91-9876543400', 'john.davis@email.com', '123 Main Street', 'Mumbai', 'Maharashtra', 'India', '400001', '1234-5678-9012', '2023-06-01', 'Grade 10'),
(10, 'James', 'Wilson', '2008-07-22', 'Mary Wilson', '+91-9876543401', 'mary.wilson@email.com', '456 Park Avenue', 'Mumbai', 'Maharashtra', 'India', '400002', '2345-6789-0123', '2023-06-01', 'Grade 10'),
(11, 'Lisa', 'Anderson', '2008-11-10', 'Tom Anderson', '+91-9876543402', 'tom.anderson@email.com', '789 Lake Road', 'Mumbai', 'Maharashtra', 'India', '400003', '3456-7890-1234', '2023-06-01', 'Grade 10'),
(12, 'Ryan', 'Martinez', '2008-05-18', 'Carlos Martinez', '+91-9876543403', 'carlos.martinez@email.com', '321 Hill Street', 'Mumbai', 'Maharashtra', 'India', '400004', '4567-8901-2345', '2023-06-01', 'Grade 10'),
(13, 'Sophia', 'Taylor', '2008-09-25', 'Linda Taylor', '+91-9876543404', 'linda.taylor@email.com', '654 Valley Drive', 'Mumbai', 'Maharashtra', 'India', '400005', '5678-9012-3456', '2023-06-01', 'Grade 10'),
(14, 'Daniel', 'Garcia', '2008-12-05', 'Jose Garcia', '+91-9876543405', 'jose.garcia@email.com', '987 River Road', 'Mumbai', 'Maharashtra', 'India', '400006', '6789-0123-4567', '2023-06-01', 'Grade 10'),
(15, 'Olivia', 'Brown', '2008-02-14', 'Susan Brown', '+91-9876543406', 'susan.brown@email.com', '246 Mountain View', 'Mumbai', 'Maharashtra', 'India', '400007', '7890-1234-5678', '2023-06-01', 'Grade 10'),
(16, 'Ethan', 'Jones', '2008-08-30', 'David Jones', '+91-9876543407', 'david.jones@email.com', '135 Forest Lane', 'Mumbai', 'Maharashtra', 'India', '400008', '8901-2345-6789', '2023-06-01', 'Grade 10'),
(17, 'Mia', 'Rodriguez', '2007-04-12', 'Maria Rodriguez', '+91-9876543408', 'maria.rodriguez@email.com', '468 Tech Park', 'Bangalore', 'Karnataka', 'India', '560001', '9012-3456-7890', '2023-06-01', 'Grade 11'),
(18, 'Noah', 'White', '2007-10-20', 'Peter White', '+91-9876543409', 'peter.white@email.com', '791 Innovation Street', 'Bangalore', 'Karnataka', 'India', '560002', '0123-4567-8901', '2023-06-01', 'Grade 11');

-- ============================================================================
-- SUBJECTS
-- ============================================================================
INSERT INTO subjects (organization_id, name, code, description, grade_level, is_active) VALUES
(1, 'Mathematics', 'MATH101', 'Advanced Mathematics covering algebra, calculus, and geometry', 'Grade 10', TRUE),
(1, 'Physics', 'PHY101', 'Introduction to Physics with laboratory work', 'Grade 10', TRUE),
(1, 'History', 'HIST101', 'World History and Social Studies', 'Grade 10', TRUE),
(1, 'Chemistry', 'CHEM101', 'General Chemistry with practical applications', 'Grade 10', TRUE),
(2, 'Computer Science', 'CS101', 'Programming and Software Development', 'Grade 11', TRUE),
(2, 'Data Structures', 'CS201', 'Advanced Data Structures and Algorithms', 'Grade 11', TRUE);

-- ============================================================================
-- COURSES
-- ============================================================================
INSERT INTO courses (subject_id, teacher_id, organization_id, course_code, title, description, term, academic_year, start_date, end_date, max_students, room, schedule, status) VALUES
(1, 4, 1, 'MATH101-F25', 'Advanced Mathematics - Fall 2025', 'Comprehensive mathematics course covering calculus and algebra', 'Fall 2025', '2025-2026', '2025-09-01', '2025-12-20', 30, 'Room 101', '{"days": ["MON", "WED", "FRI"], "time": "10:00-11:30"}', 'ACTIVE'),
(2, 5, 1, 'PHY101-F25', 'Introduction to Physics - Fall 2025', 'Physics fundamentals with hands-on experiments', 'Fall 2025', '2025-2026', '2025-09-01', '2025-12-20', 25, 'Lab 201', '{"days": ["TUE", "THU"], "time": "14:00-15:30"}', 'ACTIVE'),
(3, 6, 1, 'HIST101-F25', 'World History - Fall 2025', 'Exploring major historical events and civilizations', 'Fall 2025', '2025-2026', '2025-09-01', '2025-12-20', 35, 'Room 301', '{"days": ["MON", "WED"], "time": "11:00-12:00"}', 'ACTIVE'),
(4, 5, 1, 'CHEM101-F25', 'General Chemistry - Fall 2025', 'Chemistry principles and laboratory techniques', 'Fall 2025', '2025-2026', '2025-09-01', '2025-12-20', 25, 'Lab 202', '{"days": ["TUE", "FRI"], "time": "09:00-10:30"}', 'ACTIVE'),
(5, 7, 2, 'CS101-F25', 'Computer Science Fundamentals - Fall 2025', 'Introduction to programming and problem solving', 'Fall 2025', '2025-2026', '2025-09-01', '2025-12-20', 40, 'Computer Lab 1', '{"days": ["MON", "WED", "FRI"], "time": "13:00-14:30"}', 'ACTIVE');

-- ============================================================================
-- ENROLLMENTS
-- ============================================================================
-- Enroll all Sunrise Academy students in their courses
INSERT INTO enrollments (course_id, student_id, enrollment_date, status) VALUES
-- Course 1 (MATH101-F25) - All Sunrise students
(1, 9, '2025-09-01', 'ENROLLED'),
(1, 10, '2025-09-01', 'ENROLLED'),
(1, 11, '2025-09-01', 'ENROLLED'),
(1, 12, '2025-09-01', 'ENROLLED'),
(1, 13, '2025-09-01', 'ENROLLED'),
(1, 14, '2025-09-01', 'ENROLLED'),
(1, 15, '2025-09-01', 'ENROLLED'),
(1, 16, '2025-09-01', 'ENROLLED'),
-- Course 2 (PHY101-F25) - Most Sunrise students
(2, 9, '2025-09-01', 'ENROLLED'),
(2, 10, '2025-09-01', 'ENROLLED'),
(2, 11, '2025-09-01', 'ENROLLED'),
(2, 12, '2025-09-01', 'ENROLLED'),
(2, 13, '2025-09-01', 'ENROLLED'),
(2, 14, '2025-09-01', 'ENROLLED'),
-- Course 3 (HIST101-F25) - Some Sunrise students
(3, 9, '2025-09-01', 'ENROLLED'),
(3, 10, '2025-09-01', 'ENROLLED'),
(3, 11, '2025-09-01', 'ENROLLED'),
(3, 15, '2025-09-01', 'ENROLLED'),
(3, 16, '2025-09-01', 'ENROLLED'),
-- Course 4 (CHEM101-F25) - Some Sunrise students
(4, 12, '2025-09-01', 'ENROLLED'),
(4, 13, '2025-09-01', 'ENROLLED'),
(4, 14, '2025-09-01', 'ENROLLED'),
(4, 15, '2025-09-01', 'ENROLLED'),
-- Course 5 (CS101-F25) - Tech Institute students
(5, 17, '2025-09-01', 'ENROLLED'),
(5, 18, '2025-09-01', 'ENROLLED');

-- ============================================================================
-- LECTURES
-- ============================================================================
-- Math lectures (Past, Today, and Future)
INSERT INTO lectures (course_id, title, description, lecture_number, lecture_date, start_time, end_time, duration_minutes, location, meeting_url, status) VALUES
(1, 'Introduction to Calculus', 'Overview of differential calculus', 1, '2025-10-20', '10:00:00', '11:30:00', 90, 'Room 101', 'https://meet.nxtclass.com/math-101-1', 'COMPLETED'),
(1, 'Derivatives and Applications', 'Understanding derivatives in real-world scenarios', 2, '2025-10-22', '10:00:00', '11:30:00', 90, 'Room 101', 'https://meet.nxtclass.com/math-101-2', 'COMPLETED'),
(1, 'Integration Basics', 'Introduction to integration techniques', 3, '2025-10-23', '10:00:00', '11:30:00', 90, 'Room 101', 'https://meet.nxtclass.com/math-101-3', 'LIVE'),
(1, 'Advanced Integration', 'Complex integration problems', 4, '2025-10-25', '10:00:00', '11:30:00', 90, 'Room 101', 'https://meet.nxtclass.com/math-101-4', 'SCHEDULED'),
(1, 'Differential Equations', 'Introduction to differential equations', 5, '2025-10-27', '10:00:00', '11:30:00', 90, 'Room 101', 'https://meet.nxtclass.com/math-101-5', 'SCHEDULED');

-- Physics lectures
INSERT INTO lectures (course_id, title, description, lecture_number, lecture_date, start_time, end_time, duration_minutes, location, meeting_url, status) VALUES
(2, 'Laws of Motion', 'Newton\'s laws and applications', 1, '2025-10-21', '14:00:00', '15:30:00', 90, 'Lab 201', 'https://meet.nxtclass.com/phy-101-1', 'COMPLETED'),
(2, 'Energy and Work', 'Work-energy theorem and conservation', 2, '2025-10-23', '14:00:00', '15:30:00', 90, 'Lab 201', 'https://meet.nxtclass.com/phy-101-2', 'SCHEDULED'),
(2, 'Momentum', 'Linear momentum and collisions', 3, '2025-10-28', '14:00:00', '15:30:00', 90, 'Lab 201', 'https://meet.nxtclass.com/phy-101-3', 'SCHEDULED');

-- History lectures
INSERT INTO lectures (course_id, title, description, lecture_number, lecture_date, start_time, end_time, duration_minutes, location, meeting_url, status) VALUES
(3, 'Ancient Civilizations', 'Mesopotamia and Egypt', 1, '2025-10-20', '11:00:00', '12:00:00', 60, 'Room 301', 'https://meet.nxtclass.com/hist-101-1', 'COMPLETED'),
(3, 'Roman Empire', 'Rise and fall of Rome', 2, '2025-10-22', '11:00:00', '12:00:00', 60, 'Room 301', 'https://meet.nxtclass.com/hist-101-2', 'COMPLETED'),
(3, 'Medieval Europe', 'The Middle Ages', 3, '2025-10-23', '11:00:00', '12:00:00', 60, 'Room 301', 'https://meet.nxtclass.com/hist-101-3', 'LIVE');

-- ============================================================================
-- LECTURE ATTENDANCE
-- ============================================================================
-- Attendance for Math Lecture 1 (Completed)
INSERT INTO lecture_attendance (lecture_id, student_id, status, check_in_time, duration_minutes) VALUES
(1, 9, 'PRESENT', '2025-10-20 10:05:00', 85),
(1, 10, 'PRESENT', '2025-10-20 10:02:00', 88),
(1, 11, 'LATE', '2025-10-20 10:20:00', 70),
(1, 12, 'PRESENT', '2025-10-20 10:00:00', 90),
(1, 13, 'ABSENT', NULL, 0),
(1, 14, 'PRESENT', '2025-10-20 10:03:00', 87),
(1, 15, 'PRESENT', '2025-10-20 10:01:00', 89),
(1, 16, 'PRESENT', '2025-10-20 10:04:00', 86);

-- Attendance for Math Lecture 2 (Completed)
INSERT INTO lecture_attendance (lecture_id, student_id, status, check_in_time, duration_minutes) VALUES
(2, 9, 'PRESENT', '2025-10-22 10:01:00', 89),
(2, 10, 'PRESENT', '2025-10-22 10:00:00', 90),
(2, 11, 'PRESENT', '2025-10-22 10:03:00', 87),
(2, 12, 'LATE', '2025-10-22 10:25:00', 65),
(2, 13, 'PRESENT', '2025-10-22 10:02:00', 88),
(2, 14, 'PRESENT', '2025-10-22 10:00:00', 90),
(2, 15, 'ABSENT', NULL, 0),
(2, 16, 'PRESENT', '2025-10-22 10:05:00', 85);

-- Attendance for Physics Lecture 1 (Completed)
INSERT INTO lecture_attendance (lecture_id, student_id, status, check_in_time, duration_minutes) VALUES
(6, 9, 'PRESENT', '2025-10-21 14:00:00', 90),
(6, 10, 'PRESENT', '2025-10-21 14:02:00', 88),
(6, 11, 'PRESENT', '2025-10-21 14:01:00', 89),
(6, 12, 'PRESENT', '2025-10-21 14:00:00', 90),
(6, 13, 'LATE', '2025-10-21 14:20:00', 70),
(6, 14, 'PRESENT', '2025-10-21 14:03:00', 87);

-- ============================================================================
-- ASSIGNMENTS
-- ============================================================================
INSERT INTO assignments (course_id, teacher_id, title, description, instructions, due_date, max_points, weight_percentage, assignment_type, allow_late_submission, status) VALUES
(1, 4, 'Calculus Problem Set 1', 'Complete problems 1-20 from Chapter 5', 'Solve all problems showing detailed steps. Submit as PDF.', '2025-10-28 23:59:59', 100, 10, 'HOMEWORK', TRUE, 'PUBLISHED'),
(1, 4, 'Midterm Exam', 'Comprehensive midterm covering all topics', 'Closed book exam. Bring calculator.', '2025-11-15 14:00:00', 200, 30, 'EXAM', FALSE, 'PUBLISHED'),
(2, 5, 'Physics Lab Report 1', 'Write a lab report on the pendulum experiment', 'Follow the lab report template provided. Include data analysis.', '2025-10-25 23:59:59', 50, 15, 'LAB', TRUE, 'PUBLISHED'),
(2, 5, 'Newton\'s Laws Quiz', 'Short quiz on Newton\'s three laws', 'Online quiz, 30 minutes time limit.', '2025-10-26 23:59:59', 25, 5, 'QUIZ', FALSE, 'PUBLISHED'),
(3, 6, 'History Essay', 'Write an essay on the causes of World War I', '1500-2000 words, APA format, minimum 5 sources.', '2025-10-18 23:59:59', 100, 20, 'HOMEWORK', TRUE, 'PUBLISHED'),
(3, 6, 'Ancient Civilizations Project', 'Create a presentation on an ancient civilization', 'PowerPoint or Google Slides, 15-20 slides.', '2025-11-05 23:59:59', 150, 25, 'PROJECT', FALSE, 'PUBLISHED'),
(4, 5, 'Chemistry Worksheet 1', 'Complete the periodic table worksheet', 'Fill in all elements with their properties.', '2025-10-30 23:59:59', 75, 10, 'HOMEWORK', TRUE, 'PUBLISHED');

-- ============================================================================
-- ASSIGNMENT SUBMISSIONS
-- ============================================================================
-- Submissions for Assignment 1 (Calculus Problem Set 1) - Due: 2025-10-28
INSERT INTO assignment_submissions (assignment_id, student_id, submission_date, points_earned, max_points, status, graded_by, graded_at) VALUES
(5, 9, '2025-10-17 20:30:00', 88, 100, 'GRADED', 4, '2025-10-19 10:00:00'),
(5, 10, '2025-10-17 22:15:00', 95, 100, 'GRADED', 4, '2025-10-19 10:15:00');

-- Submissions for Assignment 5 (History Essay) - Due: 2025-10-18
INSERT INTO assignment_submissions (assignment_id, student_id, submission_date, points_earned, max_points, status, graded_by, graded_at, feedback) VALUES
(5, 9, '2025-10-17 20:30:00', 88, 100, 'GRADED', 6, '2025-10-19 14:00:00', 'Good analysis, but could use more sources'),
(5, 10, '2025-10-18 18:45:00', 95, 100, 'GRADED', 6, '2025-10-19 14:30:00', 'Excellent work! Well researched and written'),
(5, 11, '2025-10-18 22:30:00', 82, 100, 'GRADED', 6, '2025-10-19 15:00:00', 'Good effort, check grammar'),
(5, 15, NULL, NULL, 100, 'NOT_SUBMITTED', NULL, NULL, NULL),
(5, 16, '2025-10-18 11:20:00', 78, 100, 'GRADED', 6, '2025-10-19 15:30:00', 'Needs more depth in analysis');

-- Submissions for Assignment 3 (Physics Lab Report 1) - Due: 2025-10-25
INSERT INTO assignment_submissions (assignment_id, student_id, submission_date, points_earned, max_points, status) VALUES
(3, 9, '2025-10-24 19:00:00', 45, 50, 'GRADED'),
(3, 10, '2025-10-24 21:30:00', 48, 50, 'GRADED'),
(3, 11, '2025-10-25 10:00:00', NULL, 50, 'SUBMITTED');

-- ============================================================================
-- GRADES
-- ============================================================================
-- Calculate and insert overall grades for some enrollments
INSERT INTO grades (enrollment_id, course_id, student_id, total_points_earned, total_points_possible, letter_grade, gpa) VALUES
(3, 3, 11, 82, 100, 'B', 3.0),
(2, 3, 10, 95, 100, 'A', 4.0),
(1, 3, 9, 88, 100, 'B+', 3.3);

-- ============================================================================
-- GRADE COMPONENTS
-- ============================================================================
INSERT INTO grade_components (course_id, component_name, weight_percentage, description) VALUES
(1, 'Homework', 20, 'Weekly homework assignments'),
(1, 'Quizzes', 20, 'In-class quizzes'),
(1, 'Midterm', 30, 'Midterm examination'),
(1, 'Final Exam', 30, 'Comprehensive final examination'),
(2, 'Lab Reports', 30, 'Laboratory reports and experiments'),
(2, 'Homework', 20, 'Problem sets and assignments'),
(2, 'Quizzes', 20, 'Short quizzes'),
(2, 'Final Exam', 30, 'Final examination'),
(3, 'Essays', 40, 'Written essays and papers'),
(3, 'Projects', 30, 'Research projects and presentations'),
(3, 'Participation', 10, 'Class participation'),
(3, 'Final Exam', 20, 'Final examination');

-- ============================================================================
-- ANNOUNCEMENTS
-- ============================================================================
INSERT INTO announcements (organization_id, author_id, title, content, priority, target_audience, publish_date, expire_date) VALUES
(1, 1, 'School Closed Next Monday', 'The school will be closed next Monday for staff development day. All classes are cancelled.', 'HIGH', 'ALL', '2025-10-20 08:00:00', '2025-10-27 23:59:59'),
(1, 4, 'Math Midterm Exam Schedule', 'The mathematics midterm will be held on November 15th. Please prepare accordingly.', 'MEDIUM', 'STUDENTS', '2025-10-21 09:00:00', '2025-11-15 23:59:59'),
(1, 1, 'New Digital Notebook Feature', 'We have integrated Huion Note X10 support for enhanced digital note-taking. Check the Digital Notebook section!', 'MEDIUM', 'ALL', '2025-10-18 10:00:00', '2025-11-30 23:59:59'),
(1, 1, 'Parent-Teacher Conferences', 'Parent-teacher conferences will be held from October 25-27. Please schedule your appointments.', 'MEDIUM', 'PARENTS', '2025-10-15 08:00:00', '2025-10-27 23:59:59'),
(2, 2, 'Upcoming Hackathon', 'Tech Institute is organizing a 24-hour hackathon. Register by October 30th!', 'HIGH', 'STUDENTS', '2025-10-22 12:00:00', '2025-10-30 23:59:59');

-- ============================================================================
-- NOTIFICATIONS
-- ============================================================================
INSERT INTO notifications (user_id, type, title, message, related_entity_type, related_entity_id, is_read) VALUES
(9, 'ASSIGNMENT', 'New Assignment Posted', 'Calculus Problem Set 1 has been posted. Due: Oct 28', 'ASSIGNMENT', 1, FALSE),
(9, 'GRADE', 'Assignment Graded', 'Your History Essay has been graded. Score: 88/100', 'ASSIGNMENT', 5, TRUE),
(9, 'LECTURE', 'Upcoming Lecture', 'Advanced Integration lecture starts in 2 hours', 'LECTURE', 4, FALSE),
(10, 'ASSIGNMENT', 'Assignment Due Soon', 'Calculus Problem Set 1 is due tomorrow', 'ASSIGNMENT', 1, FALSE),
(4, 'SUBMISSION', 'New Submission', 'Emily Davis submitted Calculus Problem Set 1', 'ASSIGNMENT', 1, FALSE),
(4, 'SUBMISSION', 'New Submission', 'James Wilson submitted Calculus Problem Set 1', 'ASSIGNMENT', 1, FALSE);

-- ============================================================================
-- DIGITAL NOTEBOOKS
-- ============================================================================
INSERT INTO digital_notebooks (user_id, lecture_id, course_id, title, content, tags, is_shared) VALUES
(9, 1, 1, 'Calculus Lecture 1 Notes', '{"pages": [{"content": "Introduction to derivatives...", "strokes": []}]}', ARRAY['calculus', 'derivatives', 'math'], FALSE),
(9, 6, 2, 'Physics Lab Notes', '{"pages": [{"content": "Pendulum experiment observations...", "strokes": []}]}', ARRAY['physics', 'lab', 'pendulum'], FALSE),
(10, 1, 1, 'Math Class Notes - Oct 20', '{"pages": [{"content": "Differential calculus basics...", "strokes": []}]}', ARRAY['math', 'calculus'], FALSE);

-- ============================================================================
-- ANALYTICS EVENTS
-- ============================================================================
INSERT INTO analytics_events (user_id, organization_id, event_type, event_category, event_data, created_at) VALUES
(9, 1, 'LOGIN', 'AUTH', '{"ip": "192.168.1.100", "device": "laptop"}', '2025-10-23 08:30:00'),
(9, 1, 'CLASS_JOIN', 'LECTURE', '{"lecture_id": 3, "lecture_title": "Integration Basics"}', '2025-10-23 10:00:00'),
(9, 1, 'ASSIGNMENT_SUBMIT', 'ASSIGNMENT', '{"assignment_id": 5, "title": "History Essay"}', '2025-10-17 20:30:00'),
(10, 1, 'LOGIN', 'AUTH', '{"ip": "192.168.1.101", "device": "mobile"}', '2025-10-23 07:45:00'),
(10, 1, 'CLASS_JOIN', 'LECTURE', '{"lecture_id": 3, "lecture_title": "Integration Basics"}', '2025-10-23 10:02:00'),
(4, 1, 'GRADE_SUBMIT', 'GRADING', '{"student_id": 9, "assignment_id": 5, "grade": 88}', '2025-10-19 10:00:00'),
(4, 1, 'LOGIN', 'AUTH', '{"ip": "192.168.1.50", "device": "desktop"}', '2025-10-23 09:00:00');

-- ============================================================================
-- REFRESH MATERIALIZED VIEWS
-- ============================================================================
REFRESH MATERIALIZED VIEW dashboard_student_stats;
REFRESH MATERIALIZED VIEW dashboard_teacher_stats;
REFRESH MATERIALIZED VIEW dashboard_org_admin_stats;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Verify student count
SELECT 'Total Students:' as metric, COUNT(*) as count FROM users WHERE role = 'STUDENT' AND status = 'ACTIVE';

-- Verify enrollments
SELECT 'Total Enrollments:' as metric, COUNT(*) as count FROM enrollments WHERE status = 'ENROLLED';

-- Verify assignments
SELECT 'Total Assignments:' as metric, COUNT(*) as count FROM assignments WHERE status = 'PUBLISHED';

-- Verify lectures today
SELECT 'Lectures Today:' as metric, COUNT(*) as count FROM lectures WHERE lecture_date = '2025-10-23';

-- Sample dashboard queries
SELECT 'Dashboard Student Stats (Sample):' as info;
SELECT * FROM dashboard_student_stats WHERE user_id IN (9, 10) LIMIT 2;

SELECT 'Dashboard Teacher Stats (Sample):' as info;
SELECT * FROM dashboard_teacher_stats WHERE user_id = 4 LIMIT 1;

SELECT 'Dashboard Org Admin Stats (Sample):' as info;
SELECT * FROM dashboard_org_admin_stats WHERE organization_id = 1 LIMIT 1;
