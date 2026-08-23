package com.speakup.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "student_onboarding")
public class StudentOnboarding {

    @Id
    private String id;

    private String userId;

    private boolean profileCompleted;

    private EnglishLevel englishLevel;

    private boolean enrolled;

    private String subscriptionId;

    private String voucherCode;

    public enum EnglishLevel {
        BEGINNER,
        INTERMEDIATE,
        ADVANCED
    }
    
}
