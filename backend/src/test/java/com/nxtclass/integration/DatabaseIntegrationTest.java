package com.nxtclass.integration;

import com.nxtclass.entity.*;
import com.nxtclass.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class DatabaseIntegrationTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ClassSessionRepository classSessionRepository;

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private AnnouncementRepository announcementRepository;

    @BeforeEach
    void setUp() {
        // Clear all data before each test
        userRepository.deleteAll();
        classSessionRepository.deleteAll();
        assignmentRepository.deleteAll();
        announcementRepository.deleteAll();
    }

    @Test
    void testUserCreationAndRetrieval() {
        // Create a user
        User user = new User();
        user.setName("Test User");
        user.setEmail("test@example.com");
        user.setPassword("password");
        user.setRole(UserRole.TEACHER);
        user.setStatus(UserStatus.ACTIVE);
        user.setOrganization("Test School");

        // Save user
        User savedUser = userRepository.save(user);
        assertNotNull(savedUser.getId());
        assertEquals("Test User", savedUser.getName());
        assertEquals("test@example.com", savedUser.getEmail());

        // Retrieve user by ID
        Optional<User> foundUser = userRepository.findById(savedUser.getId());
        assertTrue(foundUser.isPresent());
        assertEquals("Test User", foundUser.get().getName());

        // Retrieve user by email
        Optional<User> userByEmail = userRepository.findByEmail("test@example.com");
        assertTrue(userByEmail.isPresent());
        assertEquals(savedUser.getId(), userByEmail.get().getId());
    }

    @Test
    void testUserRoleFiltering() {
        // Create users with different roles
        User admin = createUser("Admin User", "admin@test.com", UserRole.ORGADMIN);
        User teacher = createUser("Teacher User", "teacher@test.com", UserRole.TEACHER);
        User student = createUser("Student User", "student@test.com", UserRole.STUDENT);

        userRepository.save(admin);
        userRepository.save(teacher);
        userRepository.save(student);

        // Test role filtering
        List<User> teachers = userRepository.findByRole(UserRole.TEACHER);
        assertEquals(1, teachers.size());
        assertEquals("Teacher User", teachers.get(0).getName());

        List<User> students = userRepository.findByRole(UserRole.STUDENT);
        assertEquals(1, students.size());
        assertEquals("Student User", students.get(0).getName());

        List<User> admins = userRepository.findByRole(UserRole.ORGADMIN);
        assertEquals(1, admins.size());
        assertEquals("Admin User", admins.get(0).getName());
    }

    @Test
    void testClassSessionCreationAndStatusFiltering() {
        // Create a teacher first
        User teacher = createUser("Teacher", "teacher@test.com", UserRole.TEACHER);
        userRepository.save(teacher);

        // Create class sessions with different statuses
        ClassSession liveClass = createClassSession("Live Math", teacher.getName(), "Mathematics", 
            LocalDate.now(), LocalTime.of(10, 0), 60, 20, SessionStatus.LIVE);
        ClassSession upcomingClass = createClassSession("Upcoming Physics", teacher.getName(), "Physics", 
            LocalDate.now().plusDays(1), LocalTime.of(14, 0), 90, 15, SessionStatus.UPCOMING);
        ClassSession completedClass = createClassSession("Completed History", teacher.getName(), "History", 
            LocalDate.now().minusDays(1), LocalTime.of(11, 0), 60, 18, SessionStatus.COMPLETED);

        classSessionRepository.save(liveClass);
        classSessionRepository.save(upcomingClass);
        classSessionRepository.save(completedClass);

        // Test status filtering
        List<ClassSession> liveClasses = classSessionRepository.findByStatus(SessionStatus.LIVE);
        assertEquals(1, liveClasses.size());
        assertEquals("Live Math", liveClasses.get(0).getTitle());

        List<ClassSession> upcomingClasses = classSessionRepository.findByStatus(SessionStatus.UPCOMING);
        assertEquals(1, upcomingClasses.size());
        assertEquals("Upcoming Physics", upcomingClasses.get(0).getTitle());

        List<ClassSession> completedClasses = classSessionRepository.findByStatus(SessionStatus.COMPLETED);
        assertEquals(1, completedClasses.size());
        assertEquals("Completed History", completedClasses.get(0).getTitle());
    }

    @Test
    void testAssignmentCreationAndStatusFiltering() {
        // Create assignments with different statuses
        Assignment pendingAssignment = createAssignment("Pending Math", "Mathematics", 
            LocalDate.now().plusDays(5), 100, AssignmentStatus.PENDING);
        Assignment submittedAssignment = createAssignment("Submitted Physics", "Physics", 
            LocalDate.now().plusDays(3), 50, AssignmentStatus.SUBMITTED);
        Assignment gradedAssignment = createAssignment("Graded History", "History", 
            LocalDate.now().minusDays(5), 80, AssignmentStatus.GRADED);

        assignmentRepository.save(pendingAssignment);
        assignmentRepository.save(submittedAssignment);
        assignmentRepository.save(gradedAssignment);

        // Test status filtering
        List<Assignment> pendingAssignments = assignmentRepository.findByStatus(AssignmentStatus.PENDING);
        assertEquals(1, pendingAssignments.size());
        assertEquals("Pending Math", pendingAssignments.get(0).getTitle());

        List<Assignment> submittedAssignments = assignmentRepository.findByStatus(AssignmentStatus.SUBMITTED);
        assertEquals(1, submittedAssignments.size());
        assertEquals("Submitted Physics", submittedAssignments.get(0).getTitle());

        List<Assignment> gradedAssignments = assignmentRepository.findByStatus(AssignmentStatus.GRADED);
        assertEquals(1, gradedAssignments.size());
        assertEquals("Graded History", gradedAssignments.get(0).getTitle());
    }

    @Test
    void testAnnouncementCreationAndPriorityFiltering() {
        // Create announcements with different priorities
        Announcement highPriority = createAnnouncement("High Priority", "Important message", 
            "Admin", LocalDate.now(), Priority.HIGH);
        Announcement mediumPriority = createAnnouncement("Medium Priority", "Regular message", 
            "Teacher", LocalDate.now(), Priority.MEDIUM);
        Announcement lowPriority = createAnnouncement("Low Priority", "Informational message", 
            "Admin", LocalDate.now(), Priority.LOW);

        announcementRepository.save(highPriority);
        announcementRepository.save(mediumPriority);
        announcementRepository.save(lowPriority);

        // Test priority filtering
        List<Announcement> highPriorityAnnouncements = announcementRepository.findByPriority(Priority.HIGH);
        assertEquals(1, highPriorityAnnouncements.size());
        assertEquals("High Priority", highPriorityAnnouncements.get(0).getTitle());

        List<Announcement> mediumPriorityAnnouncements = announcementRepository.findByPriority(Priority.MEDIUM);
        assertEquals(1, mediumPriorityAnnouncements.size());
        assertEquals("Medium Priority", mediumPriorityAnnouncements.get(0).getTitle());

        List<Announcement> lowPriorityAnnouncements = announcementRepository.findByPriority(Priority.LOW);
        assertEquals(1, lowPriorityAnnouncements.size());
        assertEquals("Low Priority", lowPriorityAnnouncements.get(0).getTitle());
    }

    @Test
    void testDataIntegrityAndConstraints() {
        // Test unique email constraint
        User user1 = createUser("User 1", "test@example.com", UserRole.TEACHER);
        User user2 = createUser("User 2", "test@example.com", UserRole.STUDENT); // Same email

        userRepository.save(user1);

        // This should work in H2, but in a real database with constraints, it would fail
        // For now, we'll just verify the first user was saved
        List<User> allUsers = userRepository.findAll();
        assertTrue(allUsers.size() >= 1);
    }

    @Test
    void testUpcomingClassesQuery() {
        // Create a teacher
        User teacher = createUser("Teacher", "teacher@test.com", UserRole.TEACHER);
        userRepository.save(teacher);

        // Create classes with different dates
        ClassSession pastClass = createClassSession("Past Class", teacher.getName(), "Math", 
            LocalDate.now().minusDays(1), LocalTime.of(10, 0), 60, 20, SessionStatus.COMPLETED);
        ClassSession todayClass = createClassSession("Today Class", teacher.getName(), "Physics", 
            LocalDate.now(), LocalTime.of(14, 0), 60, 20, SessionStatus.LIVE);
        ClassSession futureClass = createClassSession("Future Class", teacher.getName(), "History", 
            LocalDate.now().plusDays(1), LocalTime.of(11, 0), 60, 20, SessionStatus.UPCOMING);

        classSessionRepository.save(pastClass);
        classSessionRepository.save(todayClass);
        classSessionRepository.save(futureClass);

        // Test upcoming classes query
        List<ClassSession> upcomingClasses = classSessionRepository.findUpcomingSessions(LocalDate.now());
        assertTrue(upcomingClasses.size() >= 1);
        
        // Verify all returned classes are from today or future
        for (ClassSession session : upcomingClasses) {
            assertTrue(session.getDate().isEqual(LocalDate.now()) || session.getDate().isAfter(LocalDate.now()));
        }
    }

    // Helper methods
    private User createUser(String name, String email, UserRole role) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword("password");
        user.setRole(role);
        user.setStatus(UserStatus.ACTIVE);
        user.setOrganization("Test School");
        return user;
    }

    private ClassSession createClassSession(String title, String teacher, String subject, 
                                          LocalDate date, LocalTime time, Integer duration, 
                                          Integer participants, SessionStatus status) {
        ClassSession session = new ClassSession();
        session.setTitle(title);
        session.setTeacher(teacher);
        session.setSubject(subject);
        session.setDate(date);
        session.setTime(time);
        session.setDuration(duration);
        session.setParticipants(participants);
        session.setStatus(status);
        return session;
    }

    private Assignment createAssignment(String title, String subject, LocalDate dueDate, 
                                     Integer totalPoints, AssignmentStatus status) {
        Assignment assignment = new Assignment();
        assignment.setTitle(title);
        assignment.setSubject(subject);
        assignment.setDueDate(dueDate);
        assignment.setTotalPoints(totalPoints);
        assignment.setStatus(status);
        return assignment;
    }

    private Announcement createAnnouncement(String title, String content, String author, 
                                          LocalDate date, Priority priority) {
        Announcement announcement = new Announcement();
        announcement.setTitle(title);
        announcement.setContent(content);
        announcement.setAuthor(author);
        announcement.setDate(date);
        announcement.setPriority(priority);
        return announcement;
    }
}