package com.speakup.controller;

import java.util.List; // Import the DTO

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.speakup.dto.AdminDashboardDTO;
import com.speakup.dto.ClassSessionDTO;
import com.speakup.dto.ClassSessionListDTO;
import com.speakup.model.LessonModule;
import com.speakup.model.User;
import com.speakup.service.ClassSessionService;
import com.speakup.service.LessonService;
import com.speakup.service.UserService;





@RestController
@RequestMapping("/api/admin")
@CrossOrigin
public class AdminDashboardController {

    
    private final LessonService lessonService;
    private final ClassSessionService classSessionService;
    private final UserService userService;
    

    public AdminDashboardController(LessonService lessonService, ClassSessionService classSessionService, UserService userService){
        this.lessonService = lessonService;
        this.classSessionService = classSessionService;
        this.userService = userService;
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

    @DeleteMapping("/lessons/{id}")
    public ResponseEntity<?> deleteLesson( @PathVariable String id) {
        lessonService.deleteLesson(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/lessons/{id}")
    public ResponseEntity<LessonModule> getLessonById(@PathVariable String id) {
        return ResponseEntity.ok(lessonService.getLessonById(id));
    }
    
    @PutMapping("/lessons/{id}")
    public ResponseEntity<LessonModule> updateLesson(@PathVariable String id, @RequestBody LessonModule lesson) {
        return  ResponseEntity.ok(lessonService.updateLesson(id, lesson));
    }


    @GetMapping("/classes-list")
    public List<ClassSessionListDTO> getAllClassSessions() {
        return classSessionService.getAllClassSessions();
    }

    @GetMapping("/students")
    public ResponseEntity<?> getAllStudents(){
        return ResponseEntity.ok(userService.getAllStudents());
    }

    @GetMapping("/students/search")
    public ResponseEntity<List<User>> searchUnassignedStudents(@RequestParam("query") String query) {
        List<User> students = userService.searchUnassignedStudents(query);
        return ResponseEntity.ok(students);
    }

    @GetMapping("/teachers")
    public ResponseEntity<?> getAllTeachers(){
        return ResponseEntity.ok(userService.getAllTeachers());
    }

    @GetMapping("/teachers/search")
    public ResponseEntity<List<User>> searchUnassignedTeachers(@RequestParam("query") String query) {
        List<User> teachers = userService.searchUnassignedTeachers(query);
        return ResponseEntity.ok(teachers);
    }
    
}
