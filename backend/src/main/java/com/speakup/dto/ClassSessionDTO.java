package com.speakup.dto;

import java.time.LocalTime;
import java.util.List;

import lombok.Data;

@Data
public class ClassSessionDTO {
    private String id;
    private String teacherId;
    private List<String> studentIds;
    private String lessonModuleId;
    private LocalTime dateTime; 
    private int durationMinutes;
    private String meetingLink;
    private String status;

    
    
}
