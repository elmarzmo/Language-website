package com.speakup.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
/* 
    @GetMapping("/student")

    public StudentDashboardDTO getStudentDashboard(HttpServletRequest request) {


        String studentId = (String) request.getAttribute("userId");


        if (studentId == null) {

            throw new RuntimeException("Unauthorized: No user ID found in request");

        }


        return dashboardService.getStudentDashboard(studentId);

    }
    */
   
    @PostMapping("/student/completed-lessons")
    public ResponseEntity<?> markComplete(@RequestBody Map<String, String> payload, HttpServletRequest request) {
        String studentId = (String) request.getAttribute("userId");
        String lessonId = payload.get("lessonId");


        if(studentId == null || lessonId == null) {
            return ResponseEntity.badRequest().body("User Id or lesson Id missing");
        }

        dashboardService.markLessonAsComplete(studentId, lessonId);
        return ResponseEntity.ok().build();
    }
}