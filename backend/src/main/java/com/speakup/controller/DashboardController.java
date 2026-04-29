package com.speakup.controller;

import com.speakup.dto.StudentDashboardDTO;
import com.speakup.service.DashboardService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/student/{studentId}")
    public StudentDashboardDTO getStudentDashboard(@PathVariable String studentId) {
        return dashboardService.getStudentDashboard(studentId);
    }
}