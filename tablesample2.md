# Sample School Data

All values are illustrative and align with the kindergarten-style program described.

## grade
| id | identifier | name                 | active | created_at          | updated_at          |
|----|------------|----------------------|--------|---------------------|---------------------|
| 1  | GRADE1     | Grade 1 (3-5 Years)  | TRUE   | 2025-03-01 08:00:00 | 2025-03-01 08:00:00 |
| 2  | GRADE2     | Grade 2 (5-6 Years)  | TRUE   | 2025-03-01 08:00:00 | 2025-03-01 08:00:00 |

## section
| id | identifier | grade_id | name                | capacity | active | created_at          | updated_at          |
|----|------------|----------|---------------------|----------|--------|---------------------|---------------------|
| 1  | A          | 1        | Grade 1 - Section A | 25       | TRUE   | 2025-03-01 08:15:00 | 2025-03-01 08:15:00 |
| 2  | B          | 1        | Grade 1 - Section B | 25       | TRUE   | 2025-03-01 08:15:00 | 2025-03-01 08:15:00 |
| 3  | A          | 2        | Grade 2 - Section A | 30       | TRUE   | 2025-03-01 08:15:00 | 2025-03-01 08:15:00 |
| 4  | B          | 2        | Grade 2 - Section B | 30       | TRUE   | 2025-03-01 08:15:00 | 2025-03-01 08:15:00 |

## subject
| id | identifier | name        | description                                    | active | created_at          | updated_at          |
|----|------------|-------------|------------------------------------------------|--------|---------------------|---------------------|
| 1  | YOGA       | Yoga        | Foundational yoga practice for young learners. | TRUE   | 2025-03-01 08:30:00 | 2025-03-01 08:30:00 |
| 2  | SANSKRIT   | Sanskrit    | Introductory Sanskrit chants and vocabulary.   | TRUE   | 2025-03-01 08:30:00 | 2025-03-01 08:30:00 |
| 3  | MATH       | Mathematics | Number stories and early numeracy.             | TRUE   | 2025-03-01 08:30:00 | 2025-03-01 08:30:00 |
| 4  | ENGLISH    | English     | Storytelling and phonics.                      | TRUE   | 2025-03-01 08:30:00 | 2025-03-01 08:30:00 |

## grade_subject
| id | grade_id | subject_id | required |
|----|----------|------------|----------|
| 1  | 1        | 1          | TRUE     |
| 2  | 1        | 2          | TRUE     |
| 3  | 2        | 1          | TRUE     |
| 4  | 2        | 2          | TRUE     |
| 5  | 2        | 3          | TRUE     |
| 6  | 2        | 4          | TRUE     |

## teacher
| id | identifier | first_name | last_name    | email                        | active | created_at          | updated_at          |
|----|------------|------------|--------------|------------------------------|--------|---------------------|---------------------|
| 1  | T-SHIVAM   | Shivam     | Raj          | shivam.raj@example.com       | TRUE   | 2025-03-01 09:00:00 | 2025-03-01 09:00:00 |
| 2  | T-JYOTISH  | Jyotish    | Jha          | jyotish.jha@example.com      | TRUE   | 2025-03-01 09:00:00 | 2025-03-01 09:00:00 |
| 3  | T-RIYA     | Riya       | Shrivastava  | riya.shrivastava@example.com | TRUE   | 2025-03-01 09:00:00 | 2025-03-01 09:00:00 |
| 4  | T-SHALONI  | Shaloni    | Shalu        | shaloni.shalu@example.com    | TRUE   | 2025-03-01 09:00:00 | 2025-03-01 09:00:00 |

## student
| id | identifier     | first_name | last_name | email                  | date_of_birth | active | created_at          | updated_at          |
|----|----------------|------------|-----------|------------------------|---------------|--------|---------------------|---------------------|
| 1  | STU-KRISHNA    | Krishna    | Sharma    | krishna@example.com    | 2020-05-12    | TRUE   | 2025-03-01 09:30:00 | 2025-03-01 09:30:00 |
| 2  | STU-DIVYA      | Divya      | Verma     | divya@example.com      | 2021-08-23    | TRUE   | 2025-03-01 09:30:00 | 2025-03-01 09:30:00 |
| 3  | STU-YOGESHWARI | Yogeshwari | Patel     | yogeshwari@example.com | 2020-11-02    | TRUE   | 2025-03-01 09:30:00 | 2025-03-01 09:30:00 |
| 4  | STU-TULSI      | Tulsi      | Nair      | tulsi@example.com      | 2021-02-14    | TRUE   | 2025-03-01 09:30:00 | 2025-03-01 09:30:00 |
| 5  | STU-HARI       | Hari       | Mishra    | hari@example.com       | 2019-04-03    | TRUE   | 2025-03-01 09:30:00 | 2025-03-01 09:30:00 |
| 6  | STU-PYISH      | Pyish      | Singh     | pyish@example.com      | 2019-12-18    | TRUE   | 2025-03-01 09:30:00 | 2025-03-01 09:30:00 |
| 7  | STU-RASHI      | Rashi      | Gupta     | rashi@example.com      | 2019-07-09    | TRUE   | 2025-03-01 09:30:00 | 2025-03-01 09:30:00 |
| 8  | STU-SATRUDHAN  | Satrudhan  | Yadav     | satrudhan@example.com  | 2018-11-27    | TRUE   | 2025-03-01 09:30:00 | 2025-03-01 09:30:00 |
| 9  | STU-SHYAM      | Shyam      | Kumar     | shyam@example.com      | 2018-09-15    | TRUE   | 2025-03-01 09:30:00 | 2025-03-01 09:30:00 |

## grade_section_student
| id | grade_id | section_id | student_id | effective_start | effective_end | status |
|----|----------|------------|------------|-----------------|---------------|--------|
| 1  | 1        | 1          | 1          | 2025-04-01      | NULL          | ACTIVE |
| 2  | 1        | 1          | 2          | 2025-04-01      | NULL          | ACTIVE |
| 3  | 1        | 2          | 3          | 2025-04-01      | NULL          | ACTIVE |
| 4  | 1        | 2          | 4          | 2025-04-01      | NULL          | ACTIVE |
| 5  | 2        | 3          | 5          | 2025-04-01      | NULL          | ACTIVE |
| 6  | 2        | 3          | 6          | 2025-04-01      | NULL          | ACTIVE |
| 7  | 2        | 3          | 7          | 2025-04-01      | NULL          | ACTIVE |
| 8  | 2        | 4          | 8          | 2025-04-01      | NULL          | ACTIVE |
| 9  | 2        | 4          | 9          | 2025-04-01      | NULL          | ACTIVE |

## time_slot
| id | day_of_week | start_time | end_time | room             |
|----|-------------|------------|----------|------------------|
| 1  | 1           | 06:00:00   | 07:00:00 | Yoga Hall A      |
| 2  | 1           | 08:00:00   | 10:00:00 | Classroom G1-101 |
| 3  | 2           | 06:00:00   | 07:00:00 | Yoga Hall B      |
| 4  | 2           | 08:00:00   | 10:00:00 | Classroom G1-102 |
| 5  | 3           | 06:00:00   | 07:00:00 | Yoga Hall C      |
| 6  | 3           | 15:00:00   | 16:00:00 | Classroom G2-201 |
| 7  | 3           | 10:00:00   | 11:00:00 | Classroom G2-202 |
| 8  | 3           | 09:00:00   | 10:00:00 | Classroom G2-203 |
| 9  | 4           | 06:00:00   | 07:00:00 | Yoga Hall D      |
| 10 | 4           | 15:00:00   | 16:00:00 | Classroom G2-204 |
| 11 | 4           | 10:00:00   | 11:00:00 | Classroom G2-205 |
| 12 | 4           | 09:00:00   | 10:00:00 | Classroom G2-206 |

## class_offering
| id | grade_id | section_id | subject_id | term_code | teacher_id | time_slot_id | capacity | enrollment_open | start_date  | end_date    |
|----|----------|------------|------------|-----------|------------|--------------|----------|-----------------|-------------|-------------|
| 1  | 1        | 1          | 1          | 2025-T1   | 1          | 1            | 20       | TRUE            | 2025-04-01  | 2025-09-30  |
| 2  | 1        | 1          | 2          | 2025-T1   | 2          | 2            | 20       | TRUE            | 2025-04-01  | 2025-09-30  |
| 3  | 1        | 2          | 1          | 2025-T1   | 1          | 3            | 20       | TRUE            | 2025-04-01  | 2025-09-30  |
| 4  | 1        | 2          | 2          | 2025-T1   | 2          | 4            | 20       | TRUE            | 2025-04-01  | 2025-09-30  |
| 5  | 2        | 3          | 1          | 2025-T1   | 1          | 5            | 25       | TRUE            | 2025-04-01  | 2025-09-30  |
| 6  | 2        | 3          | 3          | 2025-T1   | 1          | 6            | 25       | TRUE            | 2025-04-01  | 2025-09-30  |
| 7  | 2        | 3          | 2          | 2025-T1   | 3          | 7            | 25       | TRUE            | 2025-04-01  | 2025-09-30  |
| 8  | 2        | 3          | 4          | 2025-T1   | 4          | 8            | 25       | TRUE            | 2025-04-01  | 2025-09-30  |
| 9  | 2        | 4          | 1          | 2025-T1   | 1          | 9            | 25       | TRUE            | 2025-04-01  | 2025-09-30  |
| 10 | 2        | 4          | 3          | 2025-T1   | 1          | 10           | 25       | TRUE            | 2025-04-01  | 2025-09-30  |
| 11 | 2        | 4          | 2          | 2025-T1   | 3          | 11           | 25       | TRUE            | 2025-04-01  | 2025-09-30  |
| 12 | 2        | 4          | 4          | 2025-T1   | 4          | 12           | 25       | TRUE            | 2025-04-01  | 2025-09-30  |

## class_teacher_assignment
| id | class_offering_id | teacher_id | role    | effective_start | effective_end |
|----|-------------------|------------|---------|-----------------|---------------|
| 1  | 1                 | 1          | PRIMARY | 2025-04-01      | NULL          |
| 2  | 2                 | 2          | PRIMARY | 2025-04-01      | NULL          |
| 3  | 3                 | 1          | PRIMARY | 2025-04-01      | NULL          |
| 4  | 4                 | 2          | PRIMARY | 2025-04-01      | NULL          |
| 5  | 5                 | 1          | PRIMARY | 2025-04-01      | NULL          |
| 6  | 6                 | 1          | PRIMARY | 2025-04-01      | NULL          |
| 7  | 7                 | 3          | PRIMARY | 2025-04-01      | NULL          |
| 8  | 8                 | 4          | PRIMARY | 2025-04-01      | NULL          |
| 9  | 9                 | 1          | PRIMARY | 2025-04-01      | NULL          |
| 10 | 10                | 1          | PRIMARY | 2025-04-01      | NULL          |
| 11 | 11                | 3          | PRIMARY | 2025-04-01      | NULL          |
| 12 | 12                | 4          | PRIMARY | 2025-04-01      | NULL          |

## student_class_enrollment
| id | class_offering_id | student_id | enrollment_status | enrolled_at         | grading_period |
|----|-------------------|------------|-------------------|---------------------|----------------|
| 1  | 1                 | 1          | ENROLLED          | 2025-03-20 09:00:00 | 2025-T1        |
| 2  | 2                 | 1          | ENROLLED          | 2025-03-20 09:00:00 | 2025-T1        |
| 3  | 1                 | 2          | ENROLLED          | 2025-03-20 09:05:00 | 2025-T1        |
| 4  | 2                 | 2          | ENROLLED          | 2025-03-20 09:05:00 | 2025-T1        |
| 5  | 3                 | 3          | ENROLLED          | 2025-03-20 09:10:00 | 2025-T1        |
| 6  | 4                 | 3          | ENROLLED          | 2025-03-20 09:10:00 | 2025-T1        |
| 7  | 3                 | 4          | ENROLLED          | 2025-03-20 09:15:00 | 2025-T1        |
| 8  | 4                 | 4          | ENROLLED          | 2025-03-20 09:15:00 | 2025-T1        |
| 9  | 5                 | 5          | ENROLLED          | 2025-03-20 09:20:00 | 2025-T1        |
| 10 | 6                 | 5          | ENROLLED          | 2025-03-20 09:20:00 | 2025-T1        |
| 11 | 7                 | 5          | ENROLLED          | 2025-03-20 09:20:00 | 2025-T1        |
| 12 | 8                 | 5          | ENROLLED          | 2025-03-20 09:20:00 | 2025-T1        |
| 13 | 5                 | 6          | ENROLLED          | 2025-03-20 09:25:00 | 2025-T1        |
| 14 | 6                 | 6          | ENROLLED          | 2025-03-20 09:25:00 | 2025-T1        |
| 15 | 7                 | 6          | ENROLLED          | 2025-03-20 09:25:00 | 2025-T1        |
| 16 | 8                 | 6          | ENROLLED          | 2025-03-20 09:25:00 | 2025-T1        |
| 17 | 5                 | 7          | ENROLLED          | 2025-03-20 09:30:00 | 2025-T1        |
| 18 | 6                 | 7          | ENROLLED          | 2025-03-20 09:30:00 | 2025-T1        |
| 19 | 7                 | 7          | ENROLLED          | 2025-03-20 09:30:00 | 2025-T1        |
| 20 | 8                 | 7          | ENROLLED          | 2025-03-20 09:30:00 | 2025-T1        |
| 21 | 9                 | 8          | ENROLLED          | 2025-03-20 09:35:00 | 2025-T1        |
| 22 | 10                | 8          | ENROLLED          | 2025-03-20 09:35:00 | 2025-T1        |
| 23 | 11                | 8          | ENROLLED          | 2025-03-20 09:35:00 | 2025-T1        |
| 24 | 12                | 8          | ENROLLED          | 2025-03-20 09:35:00 | 2025-T1        |
| 25 | 9                 | 9          | ENROLLED          | 2025-03-20 09:40:00 | 2025-T1        |
| 26 | 10                | 9          | ENROLLED          | 2025-03-20 09:40:00 | 2025-T1        |
| 27 | 11                | 9          | ENROLLED          | 2025-03-20 09:40:00 | 2025-T1        |
| 28 | 12                | 9          | ENROLLED          | 2025-03-20 09:40:00 | 2025-T1        |

## class_session (Yoga on 2025-11-02)
| id | class_offering_id | session_date | time_slot_id | room_override | status    |
|----|-------------------|--------------|--------------|---------------|-----------|
| 1  | 1                 | 2025-11-02   | 1            | NULL          | COMPLETED |
| 2  | 3                 | 2025-11-02   | 3            | NULL          | COMPLETED |
| 3  | 5                 | 2025-11-02   | 5            | NULL          | COMPLETED |
| 4  | 9                 | 2025-11-02   | 9            | NULL          | COMPLETED |

## class_attendance
| id | class_session_id | student_id | attendance_status | marked_at           |
|----|------------------|------------|-------------------|---------------------|
| 1  | 1                | 1          | PRESENT           | 2025-11-02 06:05:00 |
| 2  | 1                | 2          | PRESENT           | 2025-11-02 06:05:00 |
| 3  | 2                | 3          | PRESENT           | 2025-11-02 06:05:00 |
| 4  | 2                | 4          | ABSENT            | 2025-11-02 06:05:00 |
| 5  | 3                | 5          | PRESENT           | 2025-11-02 06:05:00 |
| 6  | 3                | 6          | PRESENT           | 2025-11-02 06:05:00 |
| 7  | 3                | 7          | LATE              | 2025-11-02 06:05:00 |
| 8  | 4                | 8          | PRESENT           | 2025-11-02 06:05:00 |
| 9  | 4                | 9          | ABSENT            | 2025-11-02 06:05:00 |

## class_assignment (Yoga session by Shivam on 2025-11-02)
| id | class_session_id | title                       | description                                  | assigned_at         | due_at             | teacher_id | subject_id |
|----|------------------|-----------------------------|----------------------------------------------|---------------------|--------------------|------------|------------|
| 1  | 1                | Sun Salutation Practice     | Practice Surya Namaskar sequence 3 times.    | 2025-11-02 07:10:00 | 2025-11-04 07:00:00 | 1          | 1          |
| 2  | 2                | Breathing Focus             | Five-minute mindful breathing before class.  | 2025-11-02 07:20:00 | 2025-11-04 07:00:00 | 1          | 1          |
| 3  | 3                | Balance Pose Challenge      | Hold tree pose for 30 seconds each side.     | 2025-11-02 07:30:00 | 2025-11-04 07:00:00 | 1          | 1          |
| 4  | 4                | Stretching Reflection       | Write/draw about your favorite stretch.      | 2025-11-02 07:40:00 | 2025-11-04 07:00:00 | 1          | 1          |

## student_assignment_status
| id | class_assignment_id | student_id | status      | updated_at          | submitted_at        |
|----|---------------------|------------|-------------|---------------------|---------------------|
| 1  | 1                   | 1          | COMPLETED   | 2025-11-03 18:00:00 | 2025-11-03 17:45:00 |
| 2  | 1                   | 2          | IN_REVIEW   | 2025-11-03 18:05:00 | 2025-11-03 17:50:00 |
| 3  | 2                   | 3          | COMPLETED   | 2025-11-03 18:10:00 | 2025-11-03 18:00:00 |
| 4  | 2                   | 4          | ACTIVE      | 2025-11-03 18:15:00 | NULL                |
| 5  | 3                   | 5          | COMPLETED   | 2025-11-03 18:20:00 | 2025-11-03 18:10:00 |
| 6  | 3                   | 6          | COMPLETED   | 2025-11-03 18:25:00 | 2025-11-03 18:15:00 |
| 7  | 3                   | 7          | IN_REVIEW   | 2025-11-03 18:30:00 | 2025-11-03 18:20:00 |
| 8  | 4                   | 8          | COMPLETED   | 2025-11-03 18:35:00 | 2025-11-03 18:25:00 |
| 9  | 4                   | 9          | ACTIVE      | 2025-11-03 18:40:00 | NULL                |

## Fetching Patterns
- **Class roster for a session**: join `class_session` → `class_offering` → `student_class_enrollment` → `student`; filter by `class_session.id` and optionally merge `class_attendance` for status.
- **Student timetable**: query `student_class_enrollment` by `student_id`, join to `class_offering` → `subject`, `teacher`, and left join upcoming `class_session` rows for date-specific views.
- **Attendance history**: select from `class_attendance` by `student_id` or `class_session_id`; preload related `class_session` and `class_offering` to display grade/section context.
- **Assignment board**: fetch `class_assignment` by `class_session_id` or `class_offering_id`; attach `student_assignment_status` for each enrolled student to drive state badges (Active/In Review/Completed).
- **Teacher dashboard**: filter `class_assignment` where `teacher_id = current` and aggregate `student_assignment_status` to highlight pending reviews; use `class_attendance` counts for same session summary.
