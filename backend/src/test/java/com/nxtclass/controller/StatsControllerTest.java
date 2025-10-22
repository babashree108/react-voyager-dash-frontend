package com.nxtclass.controller;

import com.nxtclass.dto.StatDto;
import com.nxtclass.entity.AssignmentStatus;
import com.nxtclass.entity.SessionStatus;
import com.nxtclass.entity.UserRole;
import com.nxtclass.entity.UserStatus;
import com.nxtclass.repository.AssignmentRepository;
import com.nxtclass.repository.ClassSessionRepository;
import com.nxtclass.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(StatsController.class)
class StatsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private ClassSessionRepository classSessionRepository;

    @MockBean
    private AssignmentRepository assignmentRepository;

    @Test
    void getOrgAdminStats_ShouldReturnCorrectStats() throws Exception {
        // Given
        when(userRepository.countAllUsers()).thenReturn(245L);
        when(classSessionRepository.countByStatus(SessionStatus.LIVE)).thenReturn(32L);
        when(userRepository.countByRole(UserRole.TEACHER)).thenReturn(18L);
        when(userRepository.countByRole(UserRole.STUDENT)).thenReturn(227L);

        // When & Then
        mockMvc.perform(get("/api/stats/orgadmin"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(4))
                .andExpect(jsonPath("$[0].label").value("Total Users"))
                .andExpect(jsonPath("$[0].value").value(245))
                .andExpect(jsonPath("$[1].label").value("Active Classes"))
                .andExpect(jsonPath("$[1].value").value(32))
                .andExpect(jsonPath("$[2].label").value("Teachers"))
                .andExpect(jsonPath("$[2].value").value(18))
                .andExpect(jsonPath("$[3].label").value("Students"))
                .andExpect(jsonPath("$[3].value").value(227));
    }

    @Test
    void getTeacherStats_ShouldReturnCorrectStats() throws Exception {
        // Given
        when(classSessionRepository.countByStatus(SessionStatus.UPCOMING)).thenReturn(5L);
        when(userRepository.countByRole(UserRole.STUDENT)).thenReturn(124L);
        when(assignmentRepository.countByStatus(AssignmentStatus.PENDING)).thenReturn(12L);

        // When & Then
        mockMvc.perform(get("/api/stats/teacher"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(4))
                .andExpect(jsonPath("$[0].label").value("My Classes"))
                .andExpect(jsonPath("$[0].value").value(5))
                .andExpect(jsonPath("$[1].label").value("Total Students"))
                .andExpect(jsonPath("$[1].value").value(124))
                .andExpect(jsonPath("$[2].label").value("Assignments"))
                .andExpect(jsonPath("$[2].value").value(12))
                .andExpect(jsonPath("$[3].label").value("Avg. Attendance"))
                .andExpect(jsonPath("$[3].value").value("92%"));
    }

    @Test
    void getStudentStats_ShouldReturnCorrectStats() throws Exception {
        // Given
        when(classSessionRepository.countByStatus(SessionStatus.UPCOMING)).thenReturn(6L);
        when(assignmentRepository.countByStatus(AssignmentStatus.PENDING)).thenReturn(3L);

        // When & Then
        mockMvc.perform(get("/api/stats/student"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(4))
                .andExpect(jsonPath("$[0].label").value("Enrolled Classes"))
                .andExpect(jsonPath("$[0].value").value(6))
                .andExpect(jsonPath("$[1].label").value("Assignments Due"))
                .andExpect(jsonPath("$[1].value").value(3))
                .andExpect(jsonPath("$[2].label").value("Overall Grade"))
                .andExpect(jsonPath("$[2].value").value("A-"))
                .andExpect(jsonPath("$[3].label").value("Attendance"))
                .andExpect(jsonPath("$[3].value").value("95%"));
    }
}