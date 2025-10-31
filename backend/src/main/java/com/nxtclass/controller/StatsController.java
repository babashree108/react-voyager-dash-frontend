package com.nxtclass.controller;

import com.nxtclass.dto.StatDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    @GetMapping("/{type}")
    public ResponseEntity<List<StatDTO>> getStats(@PathVariable String type) {
        List<StatDTO> stats = new ArrayList<>();

        switch (type.toLowerCase()) {
            case "orgadmin":
                stats.add(new StatDTO("Total Users", 245, "+12%", "up"));
                stats.add(new StatDTO("Active Classes", 32, "+5%", "up"));
                stats.add(new StatDTO("Teachers", 18, "+2", "up"));
                stats.add(new StatDTO("Students", 227, "+10%", "up"));
                break;
            case "teacher":
                stats.add(new StatDTO("My Classes", 5, "+1", "up"));
                stats.add(new StatDTO("Total Students", 124, "+8%", "up"));
                stats.add(new StatDTO("Assignments", 12, "3 due", "up"));
                stats.add(new StatDTO("Avg. Attendance", "92%", "+3%", "up"));
                break;
            case "student":
                stats.add(new StatDTO("Enrolled Classes", 6, "On track", "up"));
                stats.add(new StatDTO("Assignments Due", 1, "This week", "up"));
                stats.add(new StatDTO("Overall Grade", "A-", "+2%", "up"));
                stats.add(new StatDTO("Attendance", "95%", "Excellent", "up"));
                break;
            default:
                // return empty list for unknown types
                break;
        }

        return ResponseEntity.ok(stats);
    }
}
