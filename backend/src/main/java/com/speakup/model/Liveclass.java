package com.speakup.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Liveclass {

    private String id;

    private String title;

    private LocalDate scheduledDate;

    private String scheduledTime; // HH:MM format

    private Integer duration; // in minutes

    private String teacherId;

    private String teacherName;

    private String meetingLink;

    private String description;

    private String recordingLink;

    private ClassStatus status = ClassStatus.SCHEDULED;

    private List<String> attendees = new ArrayList<>(); // Student IDs

    private LocalDateTime createdDate;

    private LocalDateTime updatedDate;

    public enum ClassStatus {
        SCHEDULED,
        ONGOING,
        COMPLETED,
        CANCELLED
    }

    // Lifecycle callbacks
    public void prePersist() {
        createdDate = LocalDateTime.now();
        updatedDate = LocalDateTime.now();
    }

    public void preUpdate() {
        updatedDate = LocalDateTime.now();
    }
}