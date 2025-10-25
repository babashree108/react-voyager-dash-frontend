# 🚀 Quick Start Guide - Virtual Classroom

## Prerequisites
- Node.js 18+ and npm
- Java 17+
- PostgreSQL or MySQL
- Modern web browser (Chrome/Firefox recommended)

## 1. Frontend Setup (5 minutes)

### Install Dependencies
```bash
cd /workspace
npm install
```

### Start Development Server
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 2. Backend Setup (10 minutes)

### Create Spring Boot Project
1. Go to [Spring Initializr](https://start.spring.io/)
2. Select:
   - **Project:** Maven
   - **Language:** Java
   - **Spring Boot:** 3.1.x or higher
   - **Dependencies:** 
     - Spring Web
     - Spring WebSocket
     - Spring Data JPA
     - PostgreSQL Driver (or MySQL)
     - Lombok

3. Generate and download the project

### Copy Backend Code
1. Open `BACKEND_IMPLEMENTATION.md` in this project
2. Copy all Java classes to your Spring Boot project:
   - Config files → `src/main/java/com/yourcompany/virtualclassroom/config/`
   - Models → `src/main/java/com/yourcompany/virtualclassroom/model/`
   - DTOs → `src/main/java/com/yourcompany/virtualclassroom/dto/`
   - Services → `src/main/java/com/yourcompany/virtualclassroom/service/`
   - Controllers → `src/main/java/com/yourcompany/virtualclassroom/controller/`
   - Repositories → `src/main/java/com/yourcompany/virtualclassroom/repository/`

### Configure Database
Create `application.properties`:
```properties
server.port=8080

# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/virtualclassroom
spring.datasource.username=postgres
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# WebSocket
spring.websocket.allowed-origins=http://localhost:5173
```

### Create Database
```bash
# PostgreSQL
createdb virtualclassroom

# Or using psql
psql -U postgres
CREATE DATABASE virtualclassroom;
```

### Run Backend
```bash
./mvnw spring-boot:run
```

Backend will be available at `http://localhost:8080`

## 3. Test the Application (2 minutes)

### Create a Test User (Optional)
Since we don't have authentication yet, the frontend uses mock users from localStorage.

### Test Teacher View
1. Open `http://localhost:5173/login`
2. Select "Teacher" role
3. Navigate to Virtual Classroom
4. You should see the teacher interface with controls

### Test Student View
1. Open a new incognito/private window
2. Go to `http://localhost:5173/login`
3. Select "Student" role
4. Navigate to Virtual Classroom
5. You should:
   - Be forced into fullscreen
   - See your camera always on
   - Only see the teacher's video
   - Have hand raise button

## 4. Test Digital Notebook

### As Student:
1. Click "Notebook" button in classroom
2. Draw on canvas
3. Notes automatically sync to teacher

### As Teacher:
1. View student notebooks in real-time
2. Click on notebook icon next to student name

## 5. Verify WebSocket Connection

### Check Browser Console
Look for:
```
WebSocket connected
Connected to classroom
Digital notebook ready
```

### Check Backend Logs
Look for:
```
WebSocket connection established
User joined session
```

## 🐛 Troubleshooting

### Frontend Issues

**Problem:** Cannot connect to WebSocket
```bash
# Check if backend is running
curl http://localhost:8080/api/classroom/sessions
```

**Solution:** 
- Verify backend is running on port 8080
- Check CORS configuration in backend

**Problem:** Camera/Microphone not working
- Grant browser permissions for camera/microphone
- Use HTTPS in production (HTTP only works on localhost)

### Backend Issues

**Problem:** Database connection failed
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Or for macOS
brew services list
```

**Solution:**
- Verify database credentials in `application.properties`
- Ensure database `virtualclassroom` exists

**Problem:** WebSocket not connecting
- Check `WebSocketConfig.java` is present
- Verify allowed origins includes your frontend URL

## 📱 Testing Different Roles

### Open Multiple Browser Windows
1. **Window 1 (Teacher):** Chrome normal window
2. **Window 2 (Student 1):** Chrome incognito
3. **Window 3 (Student 2):** Firefox private

### Test Scenarios

#### Scenario 1: Basic Classroom
1. Teacher starts classroom
2. Students join (auto fullscreen)
3. Teacher sees all students in sidebar
4. Students see only teacher video

#### Scenario 2: Hand Raise
1. Student clicks "Raise Hand"
2. Teacher sees hand icon next to student
3. Student's name highlighted in teacher view

#### Scenario 3: Broadcast Student
1. Teacher clicks "Broadcast" on a student
2. That student's video appears to all participants
3. Teacher clicks "Stop Broadcast" to hide

#### Scenario 4: Mute All
1. Teacher clicks "Mute All"
2. All student microphones muted
3. Students see notification

#### Scenario 5: Monitoring
1. Student tries to exit fullscreen
2. Teacher sees red alert icon
3. Violation recorded in system

#### Scenario 6: Digital Notebook
1. Student opens notebook
2. Draws on canvas
3. Teacher views student notebook live
4. Notes persist across sessions

## 🎯 Expected Behavior

### Student Experience
- ✅ Forced fullscreen on join
- ✅ Camera/mic always on
- ✅ See only teacher video
- ✅ Hand raise button works
- ✅ Digital notebook available
- ✅ Cannot access other controls

### Teacher Experience
- ✅ See all participants
- ✅ Control broadcast
- ✅ Mute all button works
- ✅ View monitoring status
- ✅ Access student notebooks
- ✅ See violations in real-time

## 🔍 Verify Installation

Run these checks:

### Frontend Check
```bash
# Dependencies installed
ls node_modules/simple-peer node_modules/socket.io-client

# Services exist
ls src/services/*.service.ts
```

### Backend Check
```bash
# Project structure
tree src/main/java/com/yourcompany/virtualclassroom/

# Build success
./mvnw clean package
```

## 📊 Monitor System

### Browser Developer Tools
- **Console:** WebSocket messages
- **Network:** WebRTC connections
- **Application:** LocalStorage data

### Backend Logs
```bash
# Follow logs
tail -f logs/spring.log

# Check specific endpoints
curl http://localhost:8080/api/classroom/sessions
```

## 🎉 Success Indicators

You'll know everything is working when:
- ✅ No console errors in browser
- ✅ WebSocket shows "connected" status
- ✅ Video streams display
- ✅ Fullscreen works for students
- ✅ Hand raise notifications appear
- ✅ Digital notebook syncs in real-time
- ✅ Backend logs show WebSocket connections

## 🆘 Get Help

If you encounter issues:

1. **Check Browser Console** for errors
2. **Check Backend Logs** for exceptions
3. **Verify Database** connection
4. **Test WebSocket** connection manually
5. **Review Configuration** files

## 📚 Next Steps

After successful setup:
1. Add authentication (Spring Security + JWT)
2. Implement recording functionality
3. Add chat feature
4. Deploy to production server
5. Set up SSL/TLS certificates
6. Configure TURN server for WebRTC

---

**Estimated Setup Time:** 15-20 minutes
**Difficulty:** Medium

Good luck! 🚀
