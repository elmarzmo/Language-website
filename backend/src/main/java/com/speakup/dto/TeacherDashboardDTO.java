package com.speakup.dto;

import java.util.List;

import lombok.Data;

@Data
public class TeacherDashboardDTO {
    private List<ClassSessionDTO> upcomingClasses;

    private int cohortCount;

    private int studentCount;
    
}
