package com.speakup.controller;

import java.util.List;

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

import com.speakup.dto.ClassSessionDTO;
import com.speakup.dto.CreateClassSessionRequest;
import com.speakup.service.ClassSessionService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/class-sessions")
@CrossOrigin
public class ClassSessionController {

    private final ClassSessionService classSessionService;
    
    public ClassSessionController(ClassSessionService classSessionService) {
        this.classSessionService = classSessionService;
    }

    // Create Session
    @PostMapping
    public ClassSessionDTO createSession(@Valid @RequestBody CreateClassSessionRequest request) {
        return classSessionService.createSession(request);
    }

/* 
    // Get student sessions
    @GetMapping("/student/{studentId}")
    public List<ClassSessionDTO> getSessionsByStudent(@PathVariable String studentId) {
        return classSessionService.getSessionsByStudent(studentId);
    }
*/
    // Get teacher sessions
    @GetMapping("/teacher/{teacherId}")
    public List<ClassSessionDTO> getSessionsByTeacher(@PathVariable String teacherId) {
        return classSessionService.getSessionsByTeacher(teacherId);
    }

    // Update session status
    @PutMapping("/{sessionId}/status")
    public ClassSessionDTO updateStatus(
            @PathVariable String sessionId,
            @RequestParam String status) {
        return classSessionService.updateStatus(sessionId, status);
    }

    // get all sessions (for admin)
    @GetMapping("/all")
    public List<ClassSessionDTO> getAllSessions() {
        return classSessionService.getAllSessions();
    }
 /* 
    @GetMapping("/admin")
    public List<ClassSessionListDTO> getAllClassSessions() {
        return classSessionService.getAllClassSessions();
    }*/

    @DeleteMapping("/{sessionId}")
    public void deleteSession(@PathVariable String sessionId) {
        classSessionService.deleteSession(sessionId);
    }




}
/*
next BCrypt password hashing

later:
Spring Security config
Role-based route protection
Refresh tokens
Proper exception handling
DTO validation
Rate limiting on login
Production deployment security */
