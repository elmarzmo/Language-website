package com.speakup.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.speakup.model.LessonModule;
import com.speakup.service.LessonService;

@RestController
@RequestMapping("/api/admin/lessons")
@CrossOrigin
public class LessonController {

    private final LessonService lessonService;

    public LessonController(LessonService lessonService) {
        this.lessonService = lessonService;
    }

    // ADMIN: create lesson
    @PostMapping("/create")
    public ResponseEntity<?> createLesson(
            @RequestBody LessonModule lesson,
            @RequestParam String userRole) {

        if (userRole == null || !userRole.equalsIgnoreCase("ADMIN")) {
            return ResponseEntity.status(403).body("Only admins can create lessons.");
        }

        return ResponseEntity.ok(lessonService.createLesson(lesson));
    }

    // ADMIN: get all lessons
    @GetMapping
    public List<LessonModule> getAllLessons() {
        return lessonService.getAllLessons();
    }
}