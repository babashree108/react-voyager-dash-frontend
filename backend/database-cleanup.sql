-- Database Cleanup Script for NXT Class
-- This script cleans up NULL fname/lname data caused by the pincode type mismatch issue
-- Run this AFTER deploying the pincode type fix

-- ============================================
-- Option 1: Delete records with NULL names
-- ============================================
-- Use this if the NULL records are test data that can be removed

-- Delete students with NULL fname or lname
DELETE FROM student_details WHERE f_name IS NULL OR l_name IS NULL;

-- Delete teachers with NULL fname or lname
DELETE FROM teacher_details WHERE f_name IS NULL OR l_name IS NULL;

-- ============================================
-- Option 2: Check NULL records before cleanup
-- ============================================
-- Use this to see what will be affected

-- Count students with NULL names
SELECT COUNT(*) as null_students 
FROM student_details 
WHERE f_name IS NULL OR l_name IS NULL;

-- Count teachers with NULL names
SELECT COUNT(*) as null_teachers 
FROM teacher_details 
WHERE f_name IS NULL OR l_name IS NULL;

-- View students with NULL names
SELECT identifier, f_name, l_name, email, phone_no, grade
FROM student_details 
WHERE f_name IS NULL OR l_name IS NULL;

-- View teachers with NULL names
SELECT identifier, f_name, l_name, email, phone_no
FROM teacher_details 
WHERE f_name IS NULL OR l_name IS NULL;

-- ============================================
-- Option 3: Update NULL records with placeholder
-- ============================================
-- Use this if you want to keep the records but fix the names

-- Update students with NULL names
UPDATE student_details 
SET f_name = COALESCE(f_name, 'Unknown'),
    l_name = COALESCE(l_name, 'Student')
WHERE f_name IS NULL OR l_name IS NULL;

-- Update teachers with NULL names
UPDATE teacher_details 
SET f_name = COALESCE(f_name, 'Unknown'),
    l_name = COALESCE(l_name, 'Teacher')
WHERE f_name IS NULL OR l_name IS NULL;

-- ============================================
-- Verification queries
-- ============================================

-- Verify no NULL names remain
SELECT 'Students with NULL names:' as check_type, COUNT(*) as count
FROM student_details 
WHERE f_name IS NULL OR l_name IS NULL
UNION ALL
SELECT 'Teachers with NULL names:' as check_type, COUNT(*) as count
FROM teacher_details 
WHERE f_name IS NULL OR l_name IS NULL;

-- View all students
SELECT identifier, f_name, l_name, email, grade FROM student_details ORDER BY identifier;

-- View all teachers
SELECT identifier, f_name, l_name, email FROM teacher_details ORDER BY identifier;
