package com.nxtclass.config;

import com.nxtclass.entity.*;
import com.nxtclass.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ClassSessionRepository classSessionRepository;
    
    @Autowired
    private AssignmentRepository assignmentRepository;
    
    @Autowired
    private AnnouncementRepository announcementRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Only initialize if no users exist
        if (userRepository.count() == 0) {
            initializeUsers();
            initializeClassSessions();
            initializeAssignments();
            initializeAnnouncements();
        }
    }

    private void initializeUsers() {
        // Create admin user
        User admin = new User();
        admin.setName("John Admin");
        admin.setEmail("admin@school.com");
        admin.setPassword(passwordEncoder.encode("password"));
        admin.setRole(UserRole.ORGADMIN);
        admin.setStatus(UserStatus.ACTIVE);
        admin.setOrganization("Sunrise Academy");
        userRepository.save(admin);

        // Create teacher users
        User teacher1 = new User();
        teacher1.setName("Sarah Johnson");
        teacher1.setEmail("sarah.j@school.com");
        teacher1.setPassword(passwordEncoder.encode("password"));
        teacher1.setRole(UserRole.TEACHER);
        teacher1.setStatus(UserStatus.ACTIVE);
        teacher1.setOrganization("Sunrise Academy");
        userRepository.save(teacher1);

        User teacher2 = new User();
        teacher2.setName("Michael Chen");
        teacher2.setEmail("michael.c@school.com");
        teacher2.setPassword(passwordEncoder.encode("password"));
        teacher2.setRole(UserRole.TEACHER);
        teacher2.setStatus(UserStatus.ACTIVE);
        teacher2.setOrganization("Sunrise Academy");
        userRepository.save(teacher2);

        // Create student users
        User student1 = new User();
        student1.setName("Emily Davis");
        student1.setEmail("emily.d@students.school.com");
        student1.setPassword(passwordEncoder.encode("password"));
        student1.setRole(UserRole.STUDENT);
        student1.setStatus(UserStatus.ACTIVE);
        student1.setOrganization("Sunrise Academy");
        userRepository.save(student1);

        User student2 = new User();
        student2.setName("James Wilson");
        student2.setEmail("james.w@students.school.com");
        student2.setPassword(passwordEncoder.encode("password"));
        student2.setRole(UserRole.STUDENT);
        student2.setStatus(UserStatus.ACTIVE);
        student2.setOrganization("Sunrise Academy");
        userRepository.save(student2);

        User student3 = new User();
        student3.setName("Lisa Anderson");
        student3.setEmail("lisa.a@students.school.com");
        student3.setPassword(passwordEncoder.encode("password"));
        student3.setRole(UserRole.STUDENT);
        student3.setStatus(UserStatus.INACTIVE);
        student3.setOrganization("Sunrise Academy");
        userRepository.save(student3);
    }

    private void initializeClassSessions() {
        // Live class
        ClassSession liveClass = new ClassSession();
        liveClass.setTitle("Advanced Mathematics");
        liveClass.setTeacher("Sarah Johnson");
        liveClass.setSubject("Mathematics");
        liveClass.setDate(LocalDate.now());
        liveClass.setTime(LocalTime.of(10, 0));
        liveClass.setDuration(60);
        liveClass.setParticipants(24);
        liveClass.setStatus(SessionStatus.LIVE);
        classSessionRepository.save(liveClass);

        // Upcoming class
        ClassSession upcomingClass = new ClassSession();
        upcomingClass.setTitle("Introduction to Physics");
        upcomingClass.setTeacher("Michael Chen");
        upcomingClass.setSubject("Physics");
        upcomingClass.setDate(LocalDate.now().plusDays(1));
        upcomingClass.setTime(LocalTime.of(14, 0));
        upcomingClass.setDuration(90);
        upcomingClass.setParticipants(18);
        upcomingClass.setStatus(SessionStatus.UPCOMING);
        classSessionRepository.save(upcomingClass);

        // Completed class
        ClassSession completedClass = new ClassSession();
        completedClass.setTitle("World History");
        completedClass.setTeacher("Sarah Johnson");
        completedClass.setSubject("History");
        completedClass.setDate(LocalDate.now().minusDays(1));
        completedClass.setTime(LocalTime.of(11, 0));
        completedClass.setDuration(60);
        completedClass.setParticipants(22);
        completedClass.setStatus(SessionStatus.COMPLETED);
        classSessionRepository.save(completedClass);
    }

    private void initializeAssignments() {
        // Pending assignment
        Assignment pendingAssignment = new Assignment();
        pendingAssignment.setTitle("Calculus Problem Set");
        pendingAssignment.setSubject("Mathematics");
        pendingAssignment.setDueDate(LocalDate.now().plusDays(5));
        pendingAssignment.setStatus(AssignmentStatus.PENDING);
        pendingAssignment.setTotalPoints(100);
        pendingAssignment.setDescription("Complete problems 1-20 from chapter 5");
        assignmentRepository.save(pendingAssignment);

        // Submitted assignment
        Assignment submittedAssignment = new Assignment();
        submittedAssignment.setTitle("Physics Lab Report");
        submittedAssignment.setSubject("Physics");
        submittedAssignment.setDueDate(LocalDate.now().plusDays(3));
        submittedAssignment.setStatus(AssignmentStatus.SUBMITTED);
        submittedAssignment.setTotalPoints(50);
        submittedAssignment.setDescription("Write a lab report on the pendulum experiment");
        assignmentRepository.save(submittedAssignment);

        // Graded assignment
        Assignment gradedAssignment = new Assignment();
        gradedAssignment.setTitle("History Essay");
        gradedAssignment.setSubject("History");
        gradedAssignment.setDueDate(LocalDate.now().minusDays(5));
        gradedAssignment.setStatus(AssignmentStatus.GRADED);
        gradedAssignment.setGrade(92);
        gradedAssignment.setTotalPoints(100);
        gradedAssignment.setDescription("Write an essay on the causes of World War I");
        assignmentRepository.save(gradedAssignment);

        // Another pending assignment
        Assignment chemistryAssignment = new Assignment();
        chemistryAssignment.setTitle("Chemistry Worksheet");
        chemistryAssignment.setSubject("Chemistry");
        chemistryAssignment.setDueDate(LocalDate.now().plusDays(7));
        chemistryAssignment.setStatus(AssignmentStatus.PENDING);
        chemistryAssignment.setTotalPoints(75);
        chemistryAssignment.setDescription("Complete the periodic table worksheet");
        assignmentRepository.save(chemistryAssignment);
    }

    private void initializeAnnouncements() {
        // High priority announcement
        Announcement highPriority = new Announcement();
        highPriority.setTitle("School Closed Next Monday");
        highPriority.setContent("The school will be closed next Monday for staff development day. All classes are cancelled.");
        highPriority.setAuthor("John Admin");
        highPriority.setDate(LocalDate.now().minusDays(3));
        highPriority.setPriority(Priority.HIGH);
        announcementRepository.save(highPriority);

        // Medium priority announcement
        Announcement mediumPriority = new Announcement();
        mediumPriority.setTitle("New Digital Notebook Feature");
        mediumPriority.setContent("We have integrated Huion Note X10 support for enhanced digital note-taking. Teachers can now use this feature in their virtual classrooms.");
        mediumPriority.setAuthor("Sarah Johnson");
        mediumPriority.setDate(LocalDate.now().minusDays(4));
        mediumPriority.setPriority(Priority.MEDIUM);
        announcementRepository.save(mediumPriority);

        // Another medium priority announcement
        Announcement parentTeacher = new Announcement();
        parentTeacher.setTitle("Parent-Teacher Conferences");
        parentTeacher.setContent("Parent-teacher conferences will be held from October 25-27. Please schedule your appointments through the school portal.");
        parentTeacher.setAuthor("John Admin");
        parentTeacher.setDate(LocalDate.now().minusDays(5));
        parentTeacher.setPriority(Priority.MEDIUM);
        announcementRepository.save(parentTeacher);
    }
}