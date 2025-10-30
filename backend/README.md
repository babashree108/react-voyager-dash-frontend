# NXT Class Backend

A Spring Boot REST API backend for the NXT Class educational platform.

## Features

- **User Management**: CRUD operations for users with role-based access (Admin, Teacher, Student)
- **Class Sessions**: Virtual classroom management with live, upcoming, and completed sessions
- **Assignments**: Assignment tracking with pending, submitted, and graded statuses
- **Announcements**: School announcements with priority levels
- **Analytics**: Dashboard statistics for different user roles
- **Authentication**: JWT-based authentication and authorization
- **CORS Support**: Configured for frontend integration

## Technology Stack

- Java 17
- Spring Boot 3.2.0
- Spring Security
- Spring Data JPA
- MySQL 8.0
- JWT for authentication
- Maven for dependency management

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Users
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `GET /api/users/role/{role}` - Get users by role
- `POST /api/users` - Create user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Class Sessions
- `GET /api/classes` - Get all class sessions
- `GET /api/classes/{id}` - Get class session by ID
- `GET /api/classes/status/{status}` - Get classes by status
- `GET /api/classes/teacher/{teacher}` - Get classes by teacher
- `GET /api/classes/upcoming` - Get upcoming classes
- `POST /api/classes` - Create class session
- `PUT /api/classes/{id}` - Update class session
- `DELETE /api/classes/{id}` - Delete class session

### Assignments
- `GET /api/assignments` - Get all assignments
- `GET /api/assignments/{id}` - Get assignment by ID
- `GET /api/assignments/status/{status}` - Get assignments by status
- `GET /api/assignments/subject/{subject}` - Get assignments by subject
- `GET /api/assignments/upcoming` - Get upcoming assignments
- `POST /api/assignments` - Create assignment
- `PUT /api/assignments/{id}` - Update assignment
- `DELETE /api/assignments/{id}` - Delete assignment

### Announcements
- `GET /api/announcements` - Get all announcements
- `GET /api/announcements/{id}` - Get announcement by ID
- `GET /api/announcements/priority/{priority}` - Get announcements by priority
- `GET /api/announcements/author/{author}` - Get announcements by author
- `GET /api/announcements/recent` - Get recent announcements
- `POST /api/announcements` - Create announcement
- `PUT /api/announcements/{id}` - Update announcement
- `DELETE /api/announcements/{id}` - Delete announcement

### Statistics
- `GET /api/stats/orgadmin` - Get organization admin statistics
- `GET /api/stats/teacher` - Get teacher statistics
- `GET /api/stats/student` - Get student statistics

## Getting Started

### Prerequisites

- Java 17 or higher
- Maven 3.8 or higher
- MySQL 8.0 or higher

### Running the Application

1. **Configure Database**
   - Ensure MySQL is running
   - Create database: `nxtClass108`
   - Update `application.properties` with your database credentials

2. **Set Environment Variables**
   ```bash
   export JWT_SECRET=$(openssl rand -base64 64 | tr -d '\n')
   export DB_URL=jdbc:mysql://localhost:3306/nxtClass108
   export DB_USERNAME=root
   export DB_PASSWORD=your_password
   ```

3. **Run the Application**
   ```bash
   cd backend
   mvn clean install
   mvn spring-boot:run
   ```

The application will start on `http://localhost:8080`

### Default Login Credentials

```
Admin:
  Email: admin@nxtclass.com
  Password: Admin@123
  Role: ORGADMIN

Teacher:
  Email: teacher@nxtclass.com
  Password: Admin@123
  Role: TEACHER

Student:
  Email: student@nxtclass.com
  Password: Admin@123
  Role: STUDENT
```

## Configuration

### Development (application-dev.properties)
- MySQL database
- Detailed logging
- Development CORS settings

### Production (application-prod.properties)
- MySQL database
- Environment variable configuration
- Optimized logging
- Production CORS settings

## CORS Configuration

The backend is configured to accept requests from `http://localhost:5173` (Vite default port) for frontend integration.

## Security

- JWT-based authentication
- Password encryption using BCrypt
- CORS configuration for frontend integration
- Role-based access control

## API Documentation

The API follows RESTful conventions and returns JSON responses. All endpoints support CORS for frontend integration.

## Frontend Integration

Configure frontend environment variables:
```env
VITE_API_URL=http://localhost:8080/api
```

The backend is configured to accept requests from the frontend with proper CORS settings.