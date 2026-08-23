package com.speakup.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.speakup.dto.StudentOnboardingDTO;
import com.speakup.service.StudentOnboardingService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/student/onboarding")
@PreAuthorize("hasRole('STUDENT')")
public class StudentOnboardingController {

    private final StudentOnboardingService studentOnboardingService;

    public StudentOnboardingController(StudentOnboardingService studentOnboardingService) {
        this.studentOnboardingService = studentOnboardingService;
    }

    @GetMapping
    public ResponseEntity<StudentOnboardingDTO> getStudentOnboarding(HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        StudentOnboardingDTO onboardingDTO = studentOnboardingService.getStudentOnboardingByUserId(userId);
        return ResponseEntity.ok(onboardingDTO);
    }

    @PutMapping
    public ResponseEntity<StudentOnboardingDTO> updateStudentOnboarding(
         @RequestBody StudentOnboardingDTO dto, HttpServletRequest request) {

       
            String userId = (String) request.getAttribute("userId");
       
            StudentOnboardingDTO updatedDTO = 
            studentOnboardingService.updateStudentOnboarding(userId, dto);
       
            return ResponseEntity.ok(updatedDTO);
    }

}
