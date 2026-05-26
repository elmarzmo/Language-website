package com.speakup.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.speakup.dto.TeacherDashboardDTO;
import com.speakup.service.TeacherDashboardService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/teacher")
public class TeacherController {

    private final TeacherDashboardService teacherDashboardService;

    public TeacherController(TeacherDashboardService teacherDashboardService ){

        this.teacherDashboardService = teacherDashboardService;
    }

    @GetMapping("/dashboard")
    public TeacherDashboardDTO getTeacherDashboar(HttpServletRequest request) {

        String teacherId = (String) request.getAttribute("userId");

        return teacherDashboardService.getTeacherDashboard(teacherId);
    }
    
}
