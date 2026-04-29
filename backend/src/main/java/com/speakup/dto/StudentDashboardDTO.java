package com.speakup.dto;

import com.speakup.model.ClassSession;
import com.speakup.model.StudentProgress;
import lombok.Data;

import java.util.List;

@Data
public class StudentDashboardDTO {
    private List<ClassSession> upcomingClasses;
    private List<StudentProgress> progressList;
}