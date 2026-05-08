package com.speakup.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.speakup.dto.StudentDashboardDTO;
import com.speakup.service.DashboardService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/student")

    public StudentDashboardDTO getStudentDashboard(HttpServletRequest request) {


        String studentId = (String) request.getAttribute("userId");


        if (studentId == null) {

            throw new RuntimeException("Unauthorized: No user ID found in request");

        }


        return dashboardService.getStudentDashboard(studentId);

    }
   
}