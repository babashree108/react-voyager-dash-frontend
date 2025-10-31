# All fName/lName Fixes Applied

## Overview
Fixed the issue where student and teacher first names (fName) and last names (lName) were being saved as NULL in the database and not displayed in the UI. The problem had three root causes:

1. **JSON Deserialization**: Frontend sent `"fName"` but backend DTO wasn't properly configured to accept it
2. **Hibernate Column Mapping**: Java fields used camelCase (`fName`, `lName`) but database columns used snake_case (`f_name`, `l_name`) without explicit mapping
3. **Frontend Display**: Frontend wasn't handling possible field name variations from the backend

---

## Backend Fixes

### 1. **BaseDTO.java** - JSON Deserialization Fix
**File**: `backend/src/main/java/com/nxtclass/dto/BaseDTO.java`

```java
import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonProperty("fName")
@JsonAlias({"fname", "f_name", "firstName", "first_name"})
private String fName;

@JsonProperty("lName")
@JsonAlias({"lname", "l_name", "lastName", "last_name"})
private String lName;
```

**What it does:**
- `@JsonProperty("fName")` - tells Jackson to look for "fName" as the primary JSON key
- `@JsonAlias(...)` - also accepts alternative key names for backward compatibility
- Accepts: `fName`, `fname`, `f_name`, `firstName`, `first_name`
- Accepts: `lName`, `lname`, `l_name`, `lastName`, `last_name`

---

### 2. **StudentDetails.java** - Hibernate Column Mapping Fix
**File**: `backend/src/main/java/com/nxtclass/entity/StudentDetails.java`

```java
import jakarta.persistence.Column;

@Column(name = "f_name")
private String fName;

@Column(name = "l_name")
private String lName;
```

**What it does:**
- Maps Java field `fName` to database column `f_name`
- Maps Java field `lName` to database column `l_name`
- Without this, Hibernate would look for columns named `fName` and `lName` (which don't exist)

---

### 3. **TeacherDetails.java** - Hibernate Column Mapping Fix
**File**: `backend/src/main/java/com/nxtclass/entity/TeacherDetails.java`

```java
import jakarta.persistence.Column;

@Column(name = "f_name")
private String fName;

@Column(name = "l_name")
private String lName;
```

**What it does:**
- Same fix as StudentDetails - maps camelCase Java fields to snake_case database columns

---

### 4. **StudentDetailsAPI.java** - Logging for Debugging
**File**: `backend/src/main/java/com/nxtclass/service/StudentDetailsAPI.java`

```java
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudentDetailsAPI {
    public Long save (StudentDetailsDTO dto) {
        log.info("=== StudentDetailsAPI.save() received ===");
        log.info("fName: {}, lName: {}, email: {}", 
                 dto.getFName(), dto.getLName(), dto.getEmail());
        // ... rest of method
    }
}
```

**What it does:**
- Logs incoming DTO values so we can verify names are being received from the frontend
- Useful for debugging any future data issues

---

## Frontend Fixes

### 5. **api.service.ts** - API Base URL Configuration
**File**: `frontend/src/api/services/api.service.ts`

```typescript
const BASE_URL = import.meta.env.VITE_API_URL || '/api';
```

**What it does:**
- Sets default API base URL to `/api` (nginx proxy path)
- Prevents frontend requests from going to the wrong endpoint

---

### 6. **Students.tsx** - Frontend Field Normalization
**File**: `frontend/src/pages/Students.tsx`

```typescript
const data = await studentService.getStudentList() as any[];
// Normalize possible backend JSON key variants (fname/fName) to fName/lName
const normalized = (data || []).map((s: any) => ({
  ...s,
  fName: s.fName ?? s.fname ?? s.firstName ?? s.first_name ?? '',
  lName: s.lName ?? s.lname ?? s.lastName ?? s.last_name ?? ''
}));
setStudents(normalized);
```

**What it does:**
- After fetching students from API, checks multiple possible field names
- Ensures `fName` and `lName` are always populated with a value (empty string if all variants are null)
- Handles both old and new data from backend

---

### 7. **Teachers.tsx** - Frontend Field Normalization
**File**: `frontend/src/pages/Teachers.tsx`

```typescript
const data = await teacherService.getTeacherList() as any[];
// Normalize name fields (fname/fName) from backend variations
const normalized = (data || []).map((t: any) => ({
  ...t,
  fName: t.fName ?? t.fname ?? t.firstName ?? t.first_name ?? '',
  lName: t.lName ?? t.lname ?? t.lastName ?? t.last_name ?? ''
}));
setTeachers(normalized);
```

**What it does:**
- Same normalization as Students.tsx for teachers list
- Ensures consistent display regardless of backend field names

---

## DevOps/Container Fixes

### 8. **start-local.sh** - MySQL Bind Address & Remote User
**File**: `start-local.sh`

```bash
# Start MySQL bound to all interfaces (0.0.0.0) for remote access
mysqld --user=mysql --bind-address=0.0.0.0 --daemonize

# Create user for both local and remote connections
mysql -e "CREATE USER IF NOT EXISTS 'nxtclass_user'@'localhost' IDENTIFIED BY 'nxtclass_pass_2024';" || true
mysql -e "CREATE USER IF NOT EXISTS 'nxtclass_user'@'%' IDENTIFIED BY 'nxtclass_pass_2024';" || true
mysql -e "GRANT ALL PRIVILEGES ON nxtclass_db.* TO 'nxtclass_user'@'localhost';" || true
mysql -e "GRANT ALL PRIVILEGES ON nxtclass_db.* TO 'nxtclass_user'@'%';" || true
```

**What it does:**
- MySQL now listens on all interfaces (0.0.0.0:3306)
- Created user `nxtclass_user@'%'` for remote connections (e.g., from DBeaver on host)
- Created user `nxtclass_user@'localhost'` for internal container processes

---

### 9. **docker-compose.local.yml** - Port Mapping
**File**: `docker-compose.local.yml`

```yaml
ports:
  - "80:80"
  - "127.0.0.1:3306:3306"
```

**What it does:**
- Maps container port 3306 to host localhost:3306
- Allows external tools like DBeaver to connect to MySQL from macOS

---

## Database Schema (Existing)

The database was already correctly set up with snake_case columns:

```sql
DESC student_details;
-- Columns: identifier, f_name, l_name, email, ... (snake_case)

DESC teacher_details;
-- Columns: identifier, f_name, l_name, email, ... (snake_case)
```

---

## Testing & Verification

### Before Fixes:
```sql
SELECT identifier, f_name, l_name FROM student_details LIMIT 1;
-- Result: identifier | f_name | l_name
--         123456    | NULL   | NULL
```

### After Fixes:
```sql
SELECT identifier, f_name, l_name FROM student_details WHERE identifier = 1761877103532;
-- Result: identifier      | f_name | l_name
--         1761877103532   | Alice  | Johnson
```

### API Response:
```bash
curl http://localhost/api/student-details/list | jq '.[] | select(.fName != null) | {fName, lName}'
# Result shows names populated correctly
```

---

## How It Works Now

### Data Flow (Save):
1. **Frontend** → sends `{"fName": "John", "lName": "Doe", "email": "john@example.com"}`
2. **nginx proxy** → routes to `http://localhost:8080/api/student-details/save`
3. **Spring Controller** → receives JSON
4. **Jackson** → uses `@JsonProperty` + `@JsonAlias` to deserialize into DTO fields
5. **Service Layer** → copies DTO fields to JPA entity
6. **Hibernate** → uses `@Column(name="f_name")` mapping to persist to database columns
7. **MySQL** → stores in `f_name` and `l_name` columns ✅

### Data Flow (Fetch):
1. **Frontend** → calls `GET /api/student-details/list`
2. **Backend** → queries MySQL, returns JSON with camelCase keys (`fName`, `lName`)
3. **Frontend** → normalizes the response (handles any field name variations)
4. **UI** → displays names in Students/Teachers table ✅

---

## Summary of Changes

| File | Change | Impact |
|------|--------|--------|
| BaseDTO.java | Added `@JsonProperty` + `@JsonAlias` | ✅ fName/lName now deserialize correctly from JSON |
| StudentDetails.java | Added `@Column(name="f_name")` mapping | ✅ Hibernate persists to correct DB columns |
| TeacherDetails.java | Added `@Column(name="l_name")` mapping | ✅ Hibernate persists to correct DB columns |
| StudentDetailsAPI.java | Added @Slf4j logging | ✅ Can debug data flow |
| Students.tsx | Added field normalization | ✅ UI handles any field name variant |
| Teachers.tsx | Added field normalization | ✅ UI handles any field name variant |
| api.service.ts | Set BASE_URL default to '/api' | ✅ Frontend requests route correctly |
| start-local.sh | Added --bind-address=0.0.0.0 + remote user | ✅ MySQL accessible from host |
| docker-compose.local.yml | Added port mapping 127.0.0.1:3306:3306 | ✅ DBeaver can connect |

---

## Next Steps

✅ **Completed:**
- New student/teacher records now save with proper names
- Names display correctly in Students/Teachers lists
- DBeaver can connect to MySQL on localhost:3306

⚠️ **Note:**
- Old records created before these fixes will have NULL names (expected)
- All new records will have names saved and displayed correctly

🔄 **To update old records:**
- Delete and re-create them via the UI, OR
- Manually run UPDATE statements in DBeaver if needed

