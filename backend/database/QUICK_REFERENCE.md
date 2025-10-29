# Database Design - Quick Reference

## Entity Relationship Diagram (Text Format)

```
┌─────────────────┐
│  Organizations  │
└────────┬────────┘
         │
         │ 1:M
         ├──────────────────────────────┐
         │                              │
         ▼                              ▼
┌─────────────────┐            ┌─────────────────┐
│      Users      │            │    Subjects     │
│  (All Roles)    │            └────────┬────────┘
└────────┬────────┘                     │
         │                              │ 1:M
         │ 1:1                          ▼
         ├──────────────┐      ┌─────────────────┐
         │              │      │     Courses     │
         ▼              ▼      └────────┬────────┘
┌──────────────┐ ┌──────────────┐      │
│   Student    │ │   Teacher    │      │ 1:M
│   Details    │ │   Details    │      ├───────────────┐
└──────────────┘ └──────────────┘      │               │
         │              │               ▼               ▼
         │              │      ┌──────────────┐ ┌──────────────┐
         │              │      │ Enrollments  │ │   Lectures   │
         │              │      └──────┬───────┘ └──────┬───────┘
         │              │             │                 │
         │              │             │ 1:1             │ 1:M
         │              │             ▼                 ▼
         │              │      ┌──────────────┐ ┌──────────────┐
         │              │      │    Grades    │ │   Lecture    │
         │              │      └──────────────┘ │  Attendance  │
         │              │                       └──────────────┘
         │              │
         │              │ 1:M
         │              └──────────┐
         │                         ▼
         │                ┌──────────────┐
         │                │ Assignments  │
         │                └──────┬───────┘
         │                       │
         │                       │ 1:M
         └───────────────────────┼──────────────┐
                                 ▼              │
                        ┌──────────────┐       │
                        │ Assignment   │       │
                        │ Submissions  │       │
                        └──────────────┘       │
                                               │
                                               ▼
                                      ┌──────────────┐
                                      │ Digital      │
                                      │ Notebooks    │
                                      └──────────────┘
```

## Core Tables Summary

### User Management (3 tables)
```
organizations → users → student_details / teacher_details
```

### Academic Structure (4 tables)
```
subjects → courses → enrollments
                  → lectures → lecture_attendance
```

### Assessments (4 tables)
```
courses → assignments → assignment_submissions
enrollments → grades
```

### Communication (2 tables)
```
announcements (standalone)
notifications (per user)
```

## Key Relationships

| Parent Table | Child Table | Relationship | Foreign Key |
|--------------|-------------|--------------|-------------|
| organizations | users | 1:M | organization_id |
| organizations | subjects | 1:M | organization_id |
| users | student_details | 1:1 | user_id |
| users | teacher_details | 1:1 | user_id |
| subjects | courses | 1:M | subject_id |
| users (teacher) | courses | 1:M | teacher_id |
| courses | enrollments | 1:M | course_id |
| users (student) | enrollments | 1:M | student_id |
| courses | lectures | 1:M | course_id |
| lectures | lecture_attendance | 1:M | lecture_id |
| users (student) | lecture_attendance | 1:M | student_id |
| courses | assignments | 1:M | course_id |
| assignments | assignment_submissions | 1:M | assignment_id |
| users (student) | assignment_submissions | 1:M | student_id |
| enrollments | grades | 1:1 | enrollment_id |

## Critical Indexes for Dashboard Queries

### Most Important Indexes
```sql
-- User lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_organization ON users(organization_id);

-- Student/Teacher details
CREATE INDEX idx_student_details_user ON student_details(user_id);
CREATE INDEX idx_teacher_details_user ON teacher_details(user_id);

-- Enrollments (heavily used)
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);

-- Assignments and submissions
CREATE INDEX idx_assignments_course ON assignments(course_id);
CREATE INDEX idx_assignments_due_date ON assignments(due_date);
CREATE INDEX idx_assignment_submissions_student ON assignment_submissions(student_id);
CREATE INDEX idx_assignment_submissions_status ON assignment_submissions(status);

-- Lectures and attendance
CREATE INDEX idx_lectures_course_date ON lectures(course_id, lecture_date);
CREATE INDEX idx_lecture_attendance_student ON lecture_attendance(student_id);
```

## Dashboard Metrics Queries

### Student Dashboard
```sql
-- Key metrics: enrolled courses, assignments due, average grade, attendance
SELECT * FROM dashboard_student_stats WHERE user_id = ?;
```

**Metrics:**
- `enrolled_courses_count`: Active course enrollments
- `assignments_due_count`: Upcoming assignments not submitted
- `average_assignment_score`: Average percentage on graded assignments
- `attendance_percentage`: Percentage of lectures attended
- `overall_gpa_percentage`: Average percentage across all courses
- `lectures_today`: Number of lectures scheduled for today

### Teacher Dashboard
```sql
-- Key metrics: courses, students, assignments, attendance rate
SELECT * FROM dashboard_teacher_stats WHERE user_id = ?;
```

**Metrics:**
- `total_courses`: Active courses taught
- `total_students`: Unique students across all courses
- `total_assignments`: Published assignments
- `pending_gradings`: Submitted assignments not yet graded
- `total_lectures`: All lectures (past and future)
- `upcoming_lectures`: Scheduled future lectures
- `lectures_today`: Lectures scheduled for today
- `average_attendance_rate`: Average attendance across all lectures

### Org Admin Dashboard
```sql
-- Key metrics: users, courses, lectures, overall stats
SELECT * FROM dashboard_org_admin_stats WHERE organization_id = ?;
```

**Metrics:**
- `total_users`: All users in the organization
- `total_students`: Active students
- `total_teachers`: Active teachers
- `total_courses`: All courses
- `active_courses`: Currently running courses
- `total_lectures`: All lectures
- `live_lectures`: Currently live lectures
- `lectures_today`: Lectures scheduled for today
- `total_assignments`: All assignments
- `overall_attendance_rate`: Organization-wide attendance

## API Endpoints Reference

### Dashboard APIs
```
GET  /api/dashboard/stats              → Get stats for current user
GET  /api/dashboard/stats/{role}       → Get stats for specific role
```

### Student Details APIs
```
GET  /api/student-details/list         → List all students
GET  /api/student-details/count        → Count active students
GET  /api/student-details/{id}         → Get student by ID
POST /api/student-details/save         → Create student
PUT  /api/student-details/update       → Update student
DEL  /api/student-details/{id}         → Delete student
```

### Course APIs (To Implement)
```
GET  /api/courses/list                 → List all courses
GET  /api/courses/active               → List active courses
GET  /api/courses/teacher/{id}         → Get courses by teacher
GET  /api/courses/student/{id}         → Get enrolled courses
POST /api/courses/create               → Create course
PUT  /api/courses/{id}                 → Update course
```

### Assignment APIs (To Implement)
```
GET  /api/assignments/course/{id}      → Get assignments by course
GET  /api/assignments/student/{id}     → Get student assignments
GET  /api/assignments/due              → Get upcoming due assignments
POST /api/assignments/create           → Create assignment
PUT  /api/assignments/{id}             → Update assignment
POST /api/assignments/{id}/submit      → Submit assignment
PUT  /api/assignments/{id}/grade       → Grade submission
```

### Lecture APIs (To Implement)
```
GET  /api/lectures/course/{id}         → Get lectures by course
GET  /api/lectures/today               → Get today's lectures
GET  /api/lectures/upcoming            → Get upcoming lectures
POST /api/lectures/create              → Create lecture
PUT  /api/lectures/{id}                → Update lecture
POST /api/lectures/{id}/attendance     → Mark attendance
```

## Database Functions

### Useful Stored Functions
```sql
-- Get student count for organization
SELECT get_student_count(1);  -- Returns: 227

-- Calculate student attendance
SELECT calculate_student_attendance(9, NULL);  -- Overall: 95.5%
SELECT calculate_student_attendance(9, 1);     -- Course 1: 92.0%

-- Refresh all dashboard views
SELECT refresh_dashboard_views();
```

## Data Flow for Dashboard

### Student Login Flow
```
1. User logs in → JWT token generated
2. Frontend calls: GET /api/dashboard/stats
3. Backend:
   a. Validates JWT token
   b. Extracts user ID and role
   c. Queries dashboard_student_stats view
   d. Returns formatted StatDTO list
4. Frontend displays stats in StatCard components
```

### Real-time Updates
```
1. Teacher grades assignment
2. Backend triggers:
   a. Update assignment_submissions table
   b. Recalculate grades table
   c. Refresh materialized views (scheduled)
   d. Send notification to student
3. Student refreshes dashboard → sees updated grade
```

## Performance Tips

### Query Optimization
1. **Use materialized views** for complex aggregations
2. **Refresh views** every 5-15 minutes (scheduled job)
3. **Cache results** in Redis for frequently accessed data
4. **Index foreign keys** and commonly queried columns
5. **Partition large tables** (analytics_events) by date

### Caching Strategy
```java
// Cache dashboard stats for 5 minutes
@Cacheable(value = "dashboardStats", key = "#userId", ttl = 300)

// Evict cache on data changes
@CacheEvict(value = "dashboardStats", key = "#studentId")
public void gradeAssignment(Long studentId, ...) { ... }
```

### Database Maintenance
```sql
-- Run weekly
VACUUM ANALYZE;

-- Run after bulk inserts
ANALYZE table_name;

-- Refresh materialized views
REFRESH MATERIALIZED VIEW CONCURRENTLY dashboard_student_stats;
```

## Migration Checklist

### Phase 1: Core Setup
- [ ] Create organizations table
- [ ] Create users table
- [ ] Create student_details table
- [ ] Create teacher_details table
- [ ] Migrate existing user data

### Phase 2: Academic Structure
- [ ] Create subjects table
- [ ] Create courses table
- [ ] Create enrollments table
- [ ] Set up relationships

### Phase 3: Learning Activities
- [ ] Create lectures table
- [ ] Create lecture_attendance table
- [ ] Migrate existing class sessions

### Phase 4: Assessments
- [ ] Create assignments table
- [ ] Create assignment_submissions table
- [ ] Create grades table
- [ ] Create grade_components table
- [ ] Migrate existing assignment data

### Phase 5: Dashboard Views
- [ ] Create dashboard_student_stats view
- [ ] Create dashboard_teacher_stats view
- [ ] Create dashboard_org_admin_stats view
- [ ] Set up refresh schedule

### Phase 6: Testing
- [ ] Test all dashboard queries
- [ ] Verify data accuracy
- [ ] Load test with sample data
- [ ] Optimize slow queries

## Quick Commands

### Database Setup
```bash
# Connect to PostgreSQL
psql -U postgres -d nxtclass

# Run schema
\i backend/database/enhanced-schema.sql

# Load sample data
\i backend/database/sample-data.sql

# Check table counts
SELECT 
  'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'courses', COUNT(*) FROM courses
UNION ALL
SELECT 'enrollments', COUNT(*) FROM enrollments;
```

### Backend Commands
```bash
# Run Spring Boot
cd backend
mvn clean install
mvn spring-boot:run

# Run tests
mvn test

# Generate jar
mvn package
```

### Frontend Commands
```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

## Troubleshooting

### Issue: Dashboard shows 0 students
**Solution:** Check if student_details.user_id matches users.id

```sql
SELECT COUNT(*) FROM users WHERE role = 'STUDENT';
SELECT COUNT(*) FROM student_details;
-- Numbers should match
```

### Issue: Slow dashboard queries
**Solution:** Check if materialized views are being used

```sql
EXPLAIN ANALYZE SELECT * FROM dashboard_student_stats WHERE user_id = 9;
-- Should use index scan, not seq scan
```

### Issue: Stats not updating
**Solution:** Refresh materialized views

```sql
REFRESH MATERIALIZED VIEW CONCURRENTLY dashboard_student_stats;
REFRESH MATERIALIZED VIEW CONCURRENTLY dashboard_teacher_stats;
REFRESH MATERIALIZED VIEW CONCURRENTLY dashboard_org_admin_stats;
```

## Support

For implementation questions, refer to:
- `DATABASE_DESIGN.md` - Complete design documentation
- `IMPLEMENTATION_GUIDE.md` - Step-by-step backend implementation
- `enhanced-schema.sql` - Complete SQL schema
- `sample-data.sql` - Test data for development
