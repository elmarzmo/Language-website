package com.speakup.dto;


import java.time.LocalDateTime;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateClassSessionRequest {

    @NotBlank(message="Teacher ID is required")
    private String teacherId;

    @NotBlank(message="Cohort ID is required")
    private String cohortId;
   
    /* 
    @NotEmpty(message="At least one student is required")
    private List<String> studentIds;
*/
    @NotBlank(message="Lesson Module Id is required")
    private String lessonModuleId;

    @NotNull (message="Date and time are required")
    private LocalDateTime dateTime; 

    @Min(value = 60, message= " Duration must be at least 1 hour")
    private int durationMinutes;

    @NotBlank(message="Meeting link is required")
    private String meetingLink;
    
}
