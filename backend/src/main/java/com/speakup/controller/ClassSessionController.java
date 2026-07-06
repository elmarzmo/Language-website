package com.speakup.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
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
public class ClassSessionController {

    private final ClassSessionService classSessionService;
    
    public ClassSessionController(ClassSessionService classSessionService) {
        this.classSessionService = classSessionService;
    }

    // Create Session
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ClassSessionDTO createSession(@Valid @RequestBody CreateClassSessionRequest request) {
        return classSessionService.createSession(request);
    }

    // Get teacher sessions
    @GetMapping("/teacher/{teacherId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public List<ClassSessionDTO> getSessionsByTeacher(@PathVariable String teacherId) {
        return classSessionService.getSessionsByTeacher(teacherId);
    }

    // Update session status
    @PutMapping("/{sessionId}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ClassSessionDTO updateStatus(
            @PathVariable String sessionId,
            @RequestParam String status) {
        return classSessionService.updateStatus(sessionId, status);
    }

    // get all sessions (for admin)
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public List<ClassSessionDTO> getAllSessions() {
        return classSessionService.getAllSessions();
    }
 
    @DeleteMapping("/{sessionId}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteSession(@PathVariable String sessionId) {
        classSessionService.deleteSession(sessionId);
    }




}