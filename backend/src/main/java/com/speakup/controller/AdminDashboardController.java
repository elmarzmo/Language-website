package com.speakup.controller;

import java.util.List; // Import the DTO

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.speakup.dto.AdminDashboardDTO;
import com.speakup.dto.ClassSessionDTO;
import com.speakup.model.LessonModule;
import com.speakup.service.ClassSessionService;
import com.speakup.service.LessonService;





@RestController
@RequestMapping("/api/admin")
@CrossOrigin
public class AdminDashboardController {

    @Autowired
    private final LessonService lessonService;
    private final ClassSessionService classSessionService;

    public AdminDashboardController(LessonService lessonService, ClassSessionService classSessionService){
        this.lessonService = lessonService;
        this.classSessionService = classSessionService;
    }

    @GetMapping("") 
    public ResponseEntity<AdminDashboardDTO> getAdminSummary() {
        AdminDashboardDTO dto = new AdminDashboardDTO();
        
        // 1. Get lesson count
        int lessons = lessonService.getAllLessons().size();
        dto.setLessonCount(lessons);

        List<ClassSessionDTO> allClasses = classSessionService.getAllSessions();
        dto.setAllClasses(allClasses);
        dto.setClassCount(allClasses.size());

     

       return ResponseEntity.ok(dto);
       
    }

    
    @GetMapping("/lessons")
    public ResponseEntity<List<LessonModule>> getAdminLessons(){
        List<LessonModule> lessons = lessonService.getAllLessons();
        return ResponseEntity.ok(lessons);
    }


     // ADMIN: create lesson
    @PostMapping("/lessons/create")
    public ResponseEntity<?> createLesson( @RequestBody LessonModule lesson) {

        return ResponseEntity.ok(lessonService.createLesson(lesson));
    }
    
    
}
