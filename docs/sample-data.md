# Sample School Data

## grade

### Schema
| Column     | Type         | Key | Notes         |
|------------|--------------|-----|---------------|
| id         | BIGINT       | PK  | Pre-seeded    |
| identifier | VARCHAR(50)  | UQ  | e.g. `GRADE1` |
| name       | VARCHAR(100) |     | Display name  |
| active     | BOOLEAN      |     | Defaults TRUE |
| created_at | DATETIME     |     | Audit field   |
| updated_at | DATETIME     |     | Audit field   |

### Sample Rows
| id | identifier | name                | active | created_at          | updated_at          |
|----|------------|---------------------|--------|---------------------|---------------------|
| 1  | GRADE1     | Grade 1 (3-5 Years) | TRUE   | 2025-03-01 08:00:00 | 2025-03-01 08:00:00 |
| 2  | GRADE2     | Grade 2 (5-6 Years) | TRUE   | 2025-03-01 08:00:00 | 2025-03-01 08:00:00 |

## section

### Schema
| Column     | Type         | Key | Notes                      |
|------------|--------------|-----|----------------------------|
| id         | BIGINT       | PK  | Pre-seeded                 |
| identifier | VARCHAR(50)  |     | Section code (A/B)         |
| grade_id   | BIGINT       | FK  | References `grade.id`      |
| name       | VARCHAR(100) |     | Friendly description       |
| capacity   | INT          |     | Optional                   |
| active     | BOOLEAN      |     | Defaults TRUE              |
| created_at | DATETIME     |     | Audit field                |
| updated_at | DATETIME     |     | Audit field                |

### Sample Rows
| id | identifier | grade_id | name                | capacity | active | created_at          | updated_at          |
|----|------------|----------|---------------------|----------|--------|---------------------|---------------------|
| 1  | A          | 1        | Grade 1 - Section A | 25       | TRUE   | 2025-03-01 08:15:00 | 2025-03-01 08:15:00 |
| 2  | B          | 1        | Grade 1 - Section B | 25       | TRUE   | 2025-03-01 08:15:00 | 2025-03-01 08:15:00 |
| 3  | A          | 2        | Grade 2 - Section A | 30       | TRUE   | 2025-03-01 08:15:00 | 2025-03-01 08:15:00 |
| 4  | B          | 2        | Grade 2 - Section B | 30       | TRUE   | 2025-03-01 08:15:00 | 2025-03-01 08:15:00 |

## subject

### Schema
| Column      | Type         | Key | Notes                       |
|-------------|--------------|-----|-----------------------------|
| id          | BIGINT       | PK  |                             |
| identifier  | VARCHAR(50)  | UQ  | e.g. `YOGA`                 |
| name        | VARCHAR(150) |     |                             |
| description | TEXT         |     | Optional                    |
| active      | BOOLEAN      |     | Defaults TRUE               |
| created_at  | DATETIME     |     | Audit field                 |
| updated_at  | DATETIME     |     | Audit field                 |

### Sample Rows
| id | identifier | name        | description                                    | active | created_at          | updated_at          |
|----|------------|-------------|------------------------------------------------|--------|---------------------|---------------------|
| 1  | YOGA       | Yoga        | Foundational yoga practice for young learners. | TRUE   | 2025-03-01 08:30:00 | 2025-03-01 08:30:00 |
| 2  | SANSKRIT   | Sanskrit    | Introductory Sanskrit chants and vocabulary.   | TRUE   | 2025-03-01 08:30:00 | 2025-03-01 08:30:00 |
| 3  | MATH       | Mathematics | Number stories and early numeracy.             | TRUE   | 2025-03-01 08:30:00 | 2025-03-01 08:30:00 |
| 4  | ENGLISH    | English     | Storytelling and phonics.                      | TRUE   | 2025-03-01 08:30:00 | 2025-03-01 08:30:00 |

## grade_subject

### Schema
| Column     | Type   | Key | Notes                   |
|------------|--------|-----|-------------------------|
| id         | BIGINT | PK  |                         |
| grade_id   | BIGINT | FK  | References `grade.id`   |
| subject_id | BIGINT | FK  | References `subject.id` |
| required   | BOOLEAN|     | TRUE = Core subject     |

### Sample Rows
| id | grade_id | subject_id | required |
|----|----------|------------|----------|
| 1  | 1        | 1          | TRUE     |
| 2  | 1        | 2          | TRUE     |
| 3  | 2        | 1          | TRUE     |
| 4  | 2        | 2          | TRUE     |
| 5  | 2        | 3          | TRUE     |
| 6  | 2        | 4          | TRUE     |

## teacher

### Schema
| Column     | Type         | Key | Notes               |
|------------|--------------|-----|---------------------|
| id         | BIGINT       | PK  |                     |
| identifier | VARCHAR(50)  | UQ  | e.g. `T-SHIVAM`     |
| first_name | VARCHAR(100) |     |                     |
| last_name  | VARCHAR(100) |     |                     |
| email      | VARCHAR(150) | UQ  | Optional            |
| active     | BOOLEAN      |     | Defaults TRUE       |
| created_at | DATETIME     |     | Audit field         |
| updated_at | DATETIME     |     | Audit field         |

### Sample Rows
| id | identifier | first_name | last_name    | email                        | active | created_at          | updated_at          |
|----|------------|------------|--------------|------------------------------|--------|---------------------|---------------------|
| 1  | T-SHIVAM   | Shivam     | Raj          | shivam.raj@example.com       | TRUE   | 2025-03-01 09:00:00 | 2025-03-01 09:00:00 |
| 2  | T-JYOTISH  | Jyotish    | Jha          | jyotish.jha@example.com      | TRUE   | 2025-03-01 09:00:00 | 2025-03-01 09:00:00 |
| 3  | T-RIYA     | Riya       | Shrivastava  | riya.shrivastava@example.com | TRUE   | 2025-03-01 09:00:00 | 2025-03-01 09:00:00 |
| 4  | T-SHALONI  | Shaloni    | Shalu        | shaloni.shalu@example.com    | TRUE   | 2025-03-01 09:00:00 | 2025-03-01 09:00:00 |

## student

### Schema
| Column       | Type         | Key | Notes                |
|--------------|--------------|-----|----------------------|
| id           | BIGINT       | PK  |                      |
| identifier   | VARCHAR(50)  | UQ  | e.g. `STU-KRISHNA`   |
| first_name   | VARCHAR(100) |     |                      |
| last_name    | VARCHAR(100) |     |                      |
| email        | VARCHAR(150) | UQ  | Optional             |
| date_of_birth| DATE         |     |                      |
| active       | BOOLEAN      |     | Defaults TRUE        |
| created_at   | DATETIME     |     | Audit field          |
| updated_at   | DATETIME     |     | Audit field          |

### Sample Rows
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

### Schema
| Column         | Type   | Key | Notes                           |
|----------------|--------|-----|---------------------------------|
| id             | BIGINT | PK  |                                 |
| grade_id       | BIGINT | FK  | References `grade.id`           |
| section_id     | BIGINT | FK  | References `section.id`         |
| student_id     | BIGINT | FK  | References `student.id`         |
| effective_start| DATE   |     | Cohort entry date               |
| effective_end  | DATE   |     | Optional exit date              |
| status         | ENUM   |     | ACTIVE / TRANSFERRED / etc.     |

### Sample Rows
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

### Schema
| Column      | Type        | Key | Notes                           |
|-------------|-------------|-----|---------------------------------|
| id          | BIGINT      | PK  |                                 |
| day_of_week | TINYINT     |     | 1 = Monday, 2 = Tuesday, …      |
| start_time  | TIME        |     |                                 |
| end_time    | TIME        |     |                                 |
| room        | VARCHAR(50) |     | Optional location               |

### Sample Rows
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

### Schema
| Column          | Type         | Key | Notes                              |
|-----------------|--------------|-----|------------------------------------|
| id              | BIGINT       | PK  |                                    |
| grade_id        | BIGINT       | FK  | References `grade.id`              |
| section_id      | BIGINT       | FK  | References `section.id`            |
| subject_id      | BIGINT       | FK  | References `subject.id`            |
| term_code       | VARCHAR(30)  | UQ  | Unique per grade/section/subject   |
| teacher_id      | BIGINT       | FK  | Primary teacher                    |
| time_slot_id    | BIGINT       | FK  | References `time_slot.id`          |
| capacity        | INT          |     | Optional                           |
| enrollment_open | BOOLEAN      |     | Defaults TRUE                      |
| start_date      | DATE         |     | Term start                         |
| end_date        | DATE         |     | Term end                           |
| created_at      | DATETIME     |     | Audit field                        |
| updated_at      | DATETIME     |     | Audit field                        |

### Sample Rows
| id | grade_id | section_id | subject_id | term_code | teacher_id | time_slot_id | capacity | enrollment_open | start_date  | end_date    | created_at          | updated_at          |
|----|----------|------------|------------|-----------|------------|--------------|----------|-----------------|-------------|-------------|---------------------|---------------------|
| 1  | 1        | 1          | 1          | 2025-T1   | 1          | 1            | 20       | TRUE            | 2025-04-01  | 2025-09-30  | 2025-03-05 08:00:00 | 2025-03-05 08:00:00 |
| 2  | 1        | 1          | 2          | 2025-T1   | 2          | 2            | 20       | TRUE            | 2025-04-01  | 2025-09-30  | 2025-03-05 08:05:00 | 2025-03-05 08:05:00 |
| 3  | 1        | 2          | 1          | 2025-T1   | 1          | 3            | 20       | TRUE            | 2025-04-01  | 2025-09-30  | 2025-03-05 08:10:00 | 2025-03-05 08:10:00 |
| 4  | 1        | 2          | 2          | 2025-T1   | 2          | 4            | 20       | TRUE            | 2025-04-01  | 2025-09-30  | 2025-03-05 08:15:00 | 2025-03-05 08:15:00 |
| 5  | 2        | 3          | 1          | 2025-T1   | 1          | 5            | 25       | TRUE            | 2025-04-01  | 2025-09-30  | 2025-03-05 08:20:00 | 2025-03-05 08:20:00 |
| 6  | 2        | 3          | 3          | 2025-T1   | 1          | 6            | 25       | TRUE            | 2025-04-01  | 2025-09-30  | 2025-03-05 08:25:00 | 2025-03-05 08:25:00 |
| 7  | 2        | 3          | 2          | 2025-T1   | 3          | 7            | 25       | TRUE            | 2025-04-01  | 2025-09-30  | 2025-03-05 08:30:00 | 2025-03-05 08:30:00 |
| 8  | 2        | 3          | 4          | 2025-T1   | 4          | 8            | 25       | TRUE            | 2025-04-01  | 2025-09-30  | 2025-03-05 08:35:00 | 2025-03-05 08:35:00 |
| 9  | 2        | 4          | 1          | 2025-T1   | 1          | 9            | 25       | TRUE            | 2025-04-01  | 2025-09-30  | 2025-03-05 08:40:00 | 2025-03-05 08:40:00 |
| 10 | 2        | 4          | 3          | 2025-T1   | 1          | 10           | 25       | TRUE            | 2025-04-01  | 2025-09-30  | 2025-03-05 08:45:00 | 2025-03-05 08:45:00 |
| 11 | 2        | 4          | 2          | 2025-T1   | 3          | 11           | 25       | TRUE            | 2025-04-01  | 2025-09-30  | 2025-03-05 08:50:00 | 2025-03-05 08:50:00 |
| 12 | 2        | 4          | 4          | 2025-T1   | 4          | 12           | 25       | TRUE            | 2025-04-01  | 2025-09-30  | 2025-03-05 08:55:00 | 2025-03-05 08:55:00 |

## class_teacher_assignment

### Schema
| Column            | Type   | Key | Notes                           |
|-------------------|--------|-----|---------------------------------|
| id                | BIGINT | PK  |                                 |
| class_offering_id | BIGINT | FK  | References `class_offering.id`  |
| teacher_id        | BIGINT | FK  | References `teacher.id`         |
| role              | ENUM   |     | PRIMARY / ASSISTANT / SUBSTITUTE|
| effective_start   | DATE   |     | Assignment start                |
| effective_end     | DATE   |     | Optional end date               |

### Sample Rows
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

### Schema
| Column            | Type         | Key | Notes                              |
|-------------------|--------------|-----|------------------------------------|
| id                | BIGINT       | PK  |                                    |
| class_offering_id | BIGINT       | FK  | References `class_offering.id`     |
| student_id        | BIGINT       | FK  | References `student.id`            |
| enrollment_status | ENUM         |     | ENROLLED / WAITLISTED / etc.       |
| enrolled_at       | DATETIME     |     |                                    |
| dropped_at        | DATETIME     |     | Optional                           |
| grading_period    | VARCHAR(30)  |     | e.g. `2025-T1`                     |

### Sample Rows
| id | class_offering_id | student_id | enrollment_status | enrolled_at         | dropped_at | grading_period |
|----|-------------------|------------|-------------------|---------------------|------------|----------------|
| 1  | 1                 | 1          | ENROLLED          | 2025-03-20 09:00:00 | NULL       | 2025-T1        |
| 2  | 2                 | 1          | ENROLLED          | 2025-03-20 09:00:00 | NULL       | 2025-T1        |
| 3  | 1                 | 2          | ENROLLED          | 2025-03-20 09:05:00 | NULL       | 2025-T1        |
| 4  | 2                 | 2          | ENROLLED          | 2025-03-20 09:05:00 | NULL       | 2025-T1        |
| 5  | 3                 | 3          | ENROLLED          | 2025-03-20 09:10:00 | NULL       | 2025-T1        |
| 6  | 4                 | 3          | ENROLLED          | 2025-03-20 09:10:00 | NULL       | 2025-T1        |
| 7  | 3                 | 4          | ENROLLED          | 2025-03-20 09:15:00 | NULL       | 2025-T1        |
| 8  | 4                 | 4          | ENROLLED          | 2025-03-20 09:15:00 | NULL       | 2025-T1        |
| 9  | 5                 | 5          | ENROLLED          | 2025-03-20 09:20:00 | NULL       | 2025-T1        |
| 10 | 6                 | 5          | ENROLLED          | 2025-03-20 09:20:00 | NULL       | 2025-T1        |
| 11 | 7                 | 5          | ENROLLED          | 2025-03-20 09:20:00 | NULL       | 2025-T1        |
| 12 | 8                 | 5          | ENROLLED          | 2025-03-20 09:20:00 | NULL       | 2025-T1        |
| 13 | 5                 | 6          | ENROLLED          | 2025-03-20 09:25:00 | NULL       | 2025-T1        |
| 14 | 6                 | 6          | ENROLLED          | 2025-03-20 09:25:00 | NULL       | 2025-T1        |
| 15 | 7                 | 6          | ENROLLED          | 2025-03-20 09:25:00 | NULL       | 2025-T1        |
| 16 | 8                 | 6          | ENROLLED          | 2025-03-20 09:25:00 | NULL       | 2025-T1        |
| 17 | 5                 | 7          | ENROLLED          | 2025-03-20 09:30:00 | NULL       | 2025-T1        |
| 18 | 6                 | 7          | ENROLLED          | 2025-03-20 09:30:00 | NULL       | 2025-T1        |
| 19 | 7                 | 7          | ENROLLED          | 2025-03-20 09:30:00 | NULL       | 2025-T1        |
| 20 | 8                 | 7          | ENROLLED          | 2025-03-20 09:30:00 | NULL       | 2025-T1        |
| 21 | 9                 | 8          | ENROLLED          | 2025-03-20 09:35:00 | NULL       | 2025-T1        |
| 22 | 10                | 8          | ENROLLED          | 2025-03-20 09:35:00 | NULL       | 2025-T1        |
| 23 | 11                | 8          | ENROLLED          | 2025-03-20 09:35:00 | NULL       | 2025-T1        |
| 24 | 12                | 8          | ENROLLED          | 2025-03-20 09:35:00 | NULL       | 2025-T1        |
| 25 | 9                 | 9          | ENROLLED          | 2025-03-20 09:40:00 | NULL       | 2025-T1        |
| 26 | 10                | 9          | ENROLLED          | 2025-03-20 09:40:00 | NULL       | 2025-T1        |
| 27 | 11                | 9          | ENROLLED          | 2025-03-20 09:40:00 | NULL       | 2025-T1        |
| 28 | 12                | 9          | ENROLLED          | 2025-03-20 09:40:00 | NULL       | 2025-T1        |
