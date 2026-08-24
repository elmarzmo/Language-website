package com.speakup.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.speakup.dto.EnrollmentRequestDTO;
import com.speakup.dto.EnrollmentResponseDTO;
import com.speakup.service.EnrollmentService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/student/enrollment")
@PreAuthorize("hasRole('STUDENT')")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    @PostMapping
    public ResponseEntity<?> enroll(
            @RequestBody EnrollmentRequestDTO request,
            HttpServletRequest httpRequest) {

        try {
            String studentId =
                    (String) httpRequest.getAttribute("userId");

            EnrollmentResponseDTO response =
                    enrollmentService.enroll(
                            studentId,
                            request
                    );

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
}