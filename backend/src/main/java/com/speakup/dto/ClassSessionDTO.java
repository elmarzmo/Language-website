package com.speakup.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ClassSessionDTO {
    private String id;
    private String teacherId;
    private String cohortId;
    private String lessonModuleId;
    private LocalDateTime dateTime;
    private int durationMinutes;
    private String meetingLink;
    private String status;

    
    
}
