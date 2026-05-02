package com.speakup.dto;


import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;

@Data
public class CreateClassSessionRequest {

    private String teacherId;
    private List<String> studentIds;
    private String lessonModuleId;
    private LocalDateTime dateTime; 
    private int durationMinutes;
    private String meetingLink;
    
}
