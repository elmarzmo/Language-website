package com.speakup.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.speakup.dto.TeacherDashboardDTO;
import com.speakup.model.LessonModule;
import com.speakup.service.LessonService;
import com.speakup.service.TeacherDashboardService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/teacher")
public class TeacherController {

    private final TeacherDashboardService teacherDashboardService;
    private final LessonService lessonService;

    public TeacherController(TeacherDashboardService teacherDashboardService, LessonService lessonService){

        this.teacherDashboardService = teacherDashboardService;
        this.lessonService = lessonService;
    }

    @GetMapping("/dashboard")
    public TeacherDashboardDTO getTeacherDashboar(HttpServletRequest request) {

        String teacherId = (String) request.getAttribute("userId");

        return teacherDashboardService.getTeacherDashboard(teacherId);
    }
    

    @GetMapping("/resources")
    public ResponseEntity<List<LessonModule>> getTeacherLessons(){
        List<LessonModule> lessons = lessonService.getAllLessons();
        return ResponseEntity.ok(lessons);
    }
}
