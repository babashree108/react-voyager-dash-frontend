# NXT Class Database Design Package

## 📋 Overview

This package contains a comprehensive, production-ready database design for the NXT Class education management platform. The design is optimized for efficient dashboard metrics, proper data relationships, and scalability.

## 📦 Package Contents

| File | Description |
|------|-------------|
| `DATABASE_DESIGN.md` | Complete database architecture, entity relationships, and design decisions |
| `enhanced-schema.sql` | Full SQL schema with tables, indexes, triggers, and materialized views |
| `sample-data.sql` | Comprehensive sample data for testing (10 students, 3 teachers, 5 courses, etc.) |
| `IMPLEMENTATION_GUIDE.md` | Step-by-step guide for implementing backend APIs and frontend integration |
| `QUICK_REFERENCE.md` | Quick reference for relationships, queries, and common operations |

## 🚀 Quick Start

### 1. Set Up Database

```bash
# Create database
createdb nxtclass

# Connect to database
psql -U postgres -d nxtclass

# Run enhanced schema
\i backend/database/enhanced-schema.sql

# Load sample data (optional, for testing)
\i backend/database/sample-data.sql
```

### 2. Verify Installation

```sql
-- Check tables created
\dt

-- View sample stats
SELECT * FROM dashboard_student_stats LIMIT 2;
SELECT * FROM dashboard_teacher_stats LIMIT 2;
SELECT * FROM dashboard_org_admin_stats LIMIT 1;

-- Check student count
SELECT get_student_count(1);
```

### 3. Test Dashboard Queries

```sql
-- Student dashboard
SELECT 
    enrolled_courses_count,
    assignments_due_count,
    attendance_percentage,
    overall_gpa_percentage
FROM dashboard_student_stats 
WHERE user_id = 9;

-- Teacher dashboard
SELECT 
    total_courses,
    total_students,
    pending_gradings,
    average_attendance_rate
FROM dashboard_teacher_stats 
WHERE user_id = 4;

-- Org admin dashboard
SELECT 
    total_students,
    total_teachers,
    active_courses,
    overall_attendance_rate
FROM dashboard_org_admin_stats 
WHERE organization_id = 1;
```

## 📊 Database Overview

### Core Design Principles

1. **✅ Normalized Structure** - Proper 3NF with strategic denormalization
2. **✅ Strong Relationships** - Foreign keys maintain referential integrity
3. **✅ Optimized Indexes** - Indexes on all frequently queried columns
4. **✅ Materialized Views** - Pre-aggregated data for fast dashboard queries
5. **✅ Audit Trail** - Timestamps on all major tables
6. **✅ Scalable** - Multi-tenant design supporting multiple organizations

### Entity Count

```
📁 Core Tables (17):
  ├── organizations          (multi-tenant support)
  ├── users                  (all roles: admin, teacher, student)
  ├── student_details        (extended student info)
  ├── teacher_details        (extended teacher info)
  ├── subjects               (academic subjects)
  ├── courses                (course instances)
  ├── enrollments            (student-course relationship)
  ├── lectures               (class sessions)
  ├── lecture_attendance     (attendance tracking)
  ├── assignments            (coursework)
  ├── assignment_submissions (student submissions)
  ├── grades                 (overall course grades)
  ├── grade_components       (grade calculation breakdown)
  ├── announcements          (communications)
  ├── notifications          (user notifications)
  ├── digital_notebooks      (note-taking)
  └── analytics_events       (activity tracking)

📊 Materialized Views (3):
  ├── dashboard_student_stats
  ├── dashboard_teacher_stats
  └── dashboard_org_admin_stats

⚡ Functions (3):
  ├── get_student_count()
  ├── calculate_student_attendance()
  └── refresh_dashboard_views()
```

## 🎯 Key Features

### 1. Dashboard Metrics (Optimized)

#### Student Dashboard
- ✅ Enrolled courses count
- ✅ Assignments due this week
- ✅ Average assignment score
- ✅ Attendance percentage
- ✅ Overall GPA
- ✅ Today's lectures

#### Teacher Dashboard
- ✅ Total active courses
- ✅ Total students (across all courses)
- ✅ Total assignments
- ✅ Pending gradings count
- ✅ Upcoming lectures
- ✅ Average attendance rate

#### Org Admin Dashboard
- ✅ Total users, students, teachers
- ✅ Total and active courses
- ✅ Live lectures count
- ✅ Today's lectures
- ✅ Overall attendance rate
- ✅ Total enrollments

### 2. Relationships

```
organizations (1) ──→ (M) users
                  └──→ (M) subjects
                  └──→ (M) courses

subjects (1) ──→ (M) courses

courses (1) ──→ (M) enrollments
            └──→ (M) lectures
            └──→ (M) assignments

enrollments (1) ──→ (1) grades

lectures (1) ──→ (M) lecture_attendance

assignments (1) ──→ (M) assignment_submissions
```

### 3. Performance Optimizations

- **50+ Indexes** on foreign keys and query columns
- **3 Materialized Views** for complex aggregations
- **Automatic Triggers** for timestamp updates and calculations
- **JSONB columns** for flexible data storage
- **Partitioning support** for large tables (analytics_events)

## 📚 Documentation Guide

### For Database Administrators
1. **Start with:** `DATABASE_DESIGN.md`
   - Understand the complete architecture
   - Review table relationships
   - Check indexing strategy

2. **Then run:** `enhanced-schema.sql`
   - Creates all tables, indexes, and views
   - Sets up triggers and functions

3. **Test with:** `sample-data.sql`
   - Loads realistic test data
   - Verifies relationships work

### For Backend Developers
1. **Start with:** `IMPLEMENTATION_GUIDE.md`
   - Entity class examples
   - Repository interfaces
   - Service layer implementation
   - Controller endpoints

2. **Reference:** `QUICK_REFERENCE.md`
   - API endpoint summary
   - Common query patterns
   - Troubleshooting tips

### For Frontend Developers
1. **Check:** `IMPLEMENTATION_GUIDE.md` → Section 6
   - Frontend integration guide
   - Updated DataService
   - Dashboard component examples

2. **API Endpoints:**
   ```
   GET  /api/dashboard/stats           → Dashboard stats
   GET  /api/student-details/count     → Student count
   GET  /api/courses/active            → Active courses
   GET  /api/assignments/due           → Due assignments
   ```

## 🔧 Implementation Steps

### Phase 1: Database Setup (1-2 days)
```bash
☐ Run enhanced-schema.sql
☐ Load sample data for testing
☐ Verify all views are created
☐ Test key queries
```

### Phase 2: Backend Implementation (3-5 days)
```bash
☐ Create all entity classes
☐ Implement repositories
☐ Build service layer
☐ Create REST controllers
☐ Add authentication/authorization
☐ Write unit tests
```

### Phase 3: Frontend Integration (2-3 days)
```bash
☐ Update API service layer
☐ Implement dashboard data fetching
☐ Test with real API calls
☐ Add error handling
☐ Implement loading states
```

### Phase 4: Testing & Optimization (2-3 days)
```bash
☐ Load test with realistic data
☐ Optimize slow queries
☐ Set up view refresh schedule
☐ Configure caching (Redis)
☐ Monitor performance
```

## 📈 Sample Data Overview

The `sample-data.sql` includes:

- **3 Organizations** (Sunrise Academy, Tech Institute, Green Valley School)
- **3 Admins** (one per organization)
- **5 Teachers** (Math, Physics, History, Chemistry, CS)
- **10 Students** (8 at Sunrise, 2 at Tech Institute)
- **6 Subjects** (Math, Physics, History, Chemistry, CS, Data Structures)
- **5 Active Courses** (Fall 2025 term)
- **24 Enrollments** (students enrolled in courses)
- **8 Lectures** (past, today, and upcoming)
- **17 Attendance Records**
- **7 Assignments** (various types and statuses)
- **8 Submissions** (some graded, some pending)
- **3 Grades** (calculated course grades)
- **12 Grade Components** (how grades are calculated)
- **5 Announcements**
- **6 Notifications**
- **3 Digital Notebooks**
- **7 Analytics Events**

## 🔍 Key Queries

### Get Student Count
```sql
-- All active students
SELECT get_student_count(NULL);

-- Students in specific organization
SELECT get_student_count(1);
```

### Dashboard Stats (Using Views)
```sql
-- Student stats (user_id = 9)
SELECT * FROM dashboard_student_stats WHERE user_id = 9;

-- Teacher stats (user_id = 4)
SELECT * FROM dashboard_teacher_stats WHERE user_id = 4;

-- Org admin stats (org_id = 1)
SELECT * FROM dashboard_org_admin_stats WHERE organization_id = 1;
```

### Upcoming Assignments
```sql
SELECT 
    a.title,
    a.due_date,
    c.title as course_title,
    asub.status
FROM assignments a
JOIN courses c ON a.course_id = c.id
JOIN enrollments e ON e.course_id = c.id
LEFT JOIN assignment_submissions asub ON asub.assignment_id = a.id AND asub.student_id = e.student_id
WHERE e.student_id = 9 
  AND a.status = 'PUBLISHED'
  AND a.due_date > NOW()
ORDER BY a.due_date ASC;
```

### Today's Lectures
```sql
SELECT 
    l.title,
    l.start_time,
    l.end_time,
    c.title as course_title,
    l.status,
    l.meeting_url
FROM lectures l
JOIN courses c ON l.course_id = c.id
WHERE l.lecture_date = CURRENT_DATE
ORDER BY l.start_time;
```

## 🛠️ Maintenance

### Daily Tasks
```sql
-- Refresh materialized views (set up cron job)
REFRESH MATERIALIZED VIEW CONCURRENTLY dashboard_student_stats;
REFRESH MATERIALIZED VIEW CONCURRENTLY dashboard_teacher_stats;
REFRESH MATERIALIZED VIEW CONCURRENTLY dashboard_org_admin_stats;
```

### Weekly Tasks
```sql
-- Vacuum and analyze
VACUUM ANALYZE;

-- Check slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

### Monthly Tasks
```sql
-- Archive old analytics events
DELETE FROM analytics_events 
WHERE created_at < NOW() - INTERVAL '90 days';

-- Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## 🐛 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Student count returns 0 | Check `student_details.user_id` → `users.id` relationship |
| Dashboard queries slow | Verify materialized views are being used, not base tables |
| Stats not updating | Run `REFRESH MATERIALIZED VIEW` or check refresh schedule |
| Missing indexes | Run `enhanced-schema.sql` again to create all indexes |
| Foreign key errors | Ensure parent records exist before inserting child records |

### Debug Queries

```sql
-- Check materialized view last refresh
SELECT schemaname, matviewname, last_refresh
FROM pg_matviews
WHERE schemaname = 'public';

-- Check index usage
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan as index_scans
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;

-- Find missing foreign key indexes
SELECT DISTINCT
    tc.table_name, 
    kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE tablename = tc.table_name 
        AND indexdef LIKE '%' || kcu.column_name || '%'
    );
```

## 📞 Support

For questions or issues:
1. Check the `QUICK_REFERENCE.md` for common solutions
2. Review `IMPLEMENTATION_GUIDE.md` for implementation details
3. Consult `DATABASE_DESIGN.md` for architecture decisions

## 🎉 What You Get

✅ **Production-Ready Schema** - Tested and optimized  
✅ **Complete Documentation** - Every table, relationship, and query explained  
✅ **Sample Data** - Realistic test data for development  
✅ **Performance Optimizations** - Indexes, views, and caching strategies  
✅ **Implementation Guide** - Step-by-step backend and frontend code  
✅ **Maintenance Scripts** - Keep your database healthy  

## 📝 Next Steps

1. **Review** `DATABASE_DESIGN.md` to understand the architecture
2. **Run** `enhanced-schema.sql` to create the database
3. **Load** `sample-data.sql` to test with realistic data
4. **Follow** `IMPLEMENTATION_GUIDE.md` to implement the backend APIs
5. **Reference** `QUICK_REFERENCE.md` for daily operations

---

**Version:** 2.0  
**Last Updated:** 2025-10-23  
**Compatible With:** PostgreSQL 12+, Spring Boot 3.x, React 18+

Good luck with your implementation! 🚀
