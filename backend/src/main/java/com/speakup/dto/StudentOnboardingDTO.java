package com.speakup.dto;

import com.speakup.model.StudentOnboarding.EnglishLevel;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentOnboardingDTO {

   
    private EnglishLevel englishLevel;
    private boolean profileCompleted;
    private boolean enrolled;

  
}
