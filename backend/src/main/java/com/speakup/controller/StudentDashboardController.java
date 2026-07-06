package com.speakup.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.speakup.dto.StudentDashboardDTO;
import com.speakup.model.LessonModule;
import com.speakup.service.LessonService;
import com.speakup.service.StudentDashboardService;

import jakarta.servlet.http.HttpServletRequest;


@RestController
@RequestMapping("/api/dashboard/student")
@PreAuthorize("hasRole('STUDENT')")
public class StudentDashboardController {

   
    private final LessonService lessonService;
    private final StudentDashboardService studentDashboardService;

    public StudentDashboardController(LessonService lessonService, StudentDashboardService studentDashboardService) {
        this.lessonService = lessonService;
        this.studentDashboardService = studentDashboardService;
    }
    

    @GetMapping

    public ResponseEntity<StudentDashboardDTO> getStudentDashboard(HttpServletRequest request) {

        String studentId = (String) request.getAttribute("userId");

        StudentDashboardDTO dashboard = 
                studentDashboardService.getStudentDashboard(studentId);
        return ResponseEntity.ok(dashboard);


    }

    @GetMapping("/lessons")
    public ResponseEntity<List<LessonModule>> getStudentLessons(){
        List<LessonModule> lessons = lessonService.getAllLessons();
        return ResponseEntity.ok(lessons);
    }
    
    
    @PostMapping("/completed-lessons")
    public ResponseEntity<Void> markComplete(@RequestBody Map<String, String> payload, HttpServletRequest request) {
        String studentId = (String) request.getAttribute("userId");
        String lessonId = payload.get("lessonId");



        studentDashboardService.markLessonAsComplete(studentId, lessonId);
        return ResponseEntity.ok().build();
    }
}
