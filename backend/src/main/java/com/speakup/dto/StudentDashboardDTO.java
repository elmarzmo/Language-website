package com.speakup.dto;

import java.util.List;

import com.speakup.model.StudentProgress;

public class StudentDashboardDTO {
    private List<ClassSessionDTO> upcomingClasses;
    private List<StudentProgress> progressList;

    // Default Constructor
    public StudentDashboardDTO() {}

    // Manual Setters (Bypasses Lombok issues)
    public void setUpcomingClasses(List<ClassSessionDTO> upcomingClasses) {
        this.upcomingClasses = upcomingClasses;
    }

    public void setProgressList(List<StudentProgress> progressList) {
        this.progressList = progressList;
    }

    // Manual Getters
    public List<ClassSessionDTO> getUpcomingClasses() {
        return upcomingClasses;
    }

    public List<StudentProgress> getProgressList() {
        return progressList;
    }

   

}