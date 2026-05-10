package com.speakup.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.speakup.model.LessonModule;
import com.speakup.service.LessonService;


@RestController
@RequestMapping("/api/dashboard/student")
@CrossOrigin
public class StudentDashboardController {
    @Autowired
    private final LessonService lessonService;

    public StudentDashboardController(LessonService lessonService){
        this.lessonService = lessonService;
    }
    
    @GetMapping("/lessons")
    public ResponseEntity<List<LessonModule>> getStudentLessons(){
        List<LessonModule> lessons = lessonService.getAllLessons();
        return ResponseEntity.ok(lessons);
    }
    
}
