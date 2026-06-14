package com.speakup.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ClassSessionListDTO {
    private String id;
    private String teacherName;
    private String cohortName;
    private String lessonModuleTitle;
    private LocalDateTime dateTime;
    private int durationMinutes;
    private String meetingLink;
    private String status;

    private int enrolledStudentCount;
}
