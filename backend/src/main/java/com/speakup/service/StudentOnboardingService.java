package com.speakup.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.speakup.dto.StudentOnboardingDTO;
import com.speakup.model.StudentOnboarding;
import com.speakup.repository.StudentOnboardingRepository;

@Service
public class StudentOnboardingService {
    private final StudentOnboardingRepository studentOnboardingRepository;

    public StudentOnboardingService(StudentOnboardingRepository studentOnboardingRepository) {
        this.studentOnboardingRepository = studentOnboardingRepository;
    }

    public StudentOnboardingDTO getStudentOnboardingByUserId(String userId) {
      
        StudentOnboarding studentOnboarding = studentOnboardingRepository.findByUserId(userId)
                     .orElseGet(() -> createStudentOnboarding(userId));

        return toDto(studentOnboarding);
    }

    public StudentOnboarding createStudentOnboarding(String userId) {

        Optional<StudentOnboarding> existingONboarding = studentOnboardingRepository.findByUserId(userId);

        if (existingONboarding.isPresent()) {
            return existingONboarding.get();
        }


        StudentOnboarding studentOnboarding = new StudentOnboarding();
        studentOnboarding.setUserId(userId);
        studentOnboarding.setProfileCompleted(false);
        studentOnboarding.setEnrolled(false);

        return studentOnboardingRepository.save(studentOnboarding);
    }

    public StudentOnboardingDTO updateStudentOnboarding(String userId, StudentOnboardingDTO dto) {
        StudentOnboarding studentOnboarding = studentOnboardingRepository.findByUserId(userId)
                .orElseGet(() -> createStudentOnboarding(userId));

        // Update the studentOnboarding object with values from the DTO
        studentOnboarding.setEnglishLevel(dto.getEnglishLevel());
        studentOnboarding.setProfileCompleted(dto.isProfileCompleted());

    StudentOnboarding saved = studentOnboardingRepository.save(studentOnboarding);
    return toDto(saved);
    }

    private StudentOnboardingDTO toDto(StudentOnboarding studentOnboarding) {
        StudentOnboardingDTO dto = new StudentOnboardingDTO();
        dto.setEnglishLevel(studentOnboarding.getEnglishLevel());
        dto.setProfileCompleted(studentOnboarding.isProfileCompleted());
        return dto;
    }
}
