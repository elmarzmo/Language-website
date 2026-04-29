package com.speakup.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "student_progress")
@Data
public class StudentProgress {

    @Id
    private String id;

    private String studentId;

    private String lessonModuleId;

    private int progressPercentage;

    private boolean completed;

    private long lastUpdated; // Timestamp of last update
}