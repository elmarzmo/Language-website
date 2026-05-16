package com.speakup.model;

import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "student_progress")
@Data
public class StudentProgress {

    @Id
    private String id;

    private String studentId;

    private String lessonModuleId;

    private int progressPercentage;

    private boolean completed;

    private Instant lastUpdated; // Timestamp of last update
}