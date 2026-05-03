package com.speakup.dto;

import java.util.List;

import com.speakup.model.ClassSession;
import com.speakup.model.StudentProgress;

public class StudentDashboardDTO {
    private List<ClassSession> upcomingClasses;
    private List<StudentProgress> progressList;

    // Default Constructor
    public StudentDashboardDTO() {}

    // Manual Setters (Bypasses Lombok issues)
    public void setUpcomingClasses(List<ClassSession> upcomingClasses) {
        this.upcomingClasses = upcomingClasses;
    }

    public void setProgressList(List<StudentProgress> progressList) {
        this.progressList = progressList;
    }

    // Manual Getters
    public List<ClassSession> getUpcomingClasses() {
        return upcomingClasses;
    }

    public List<StudentProgress> getProgressList() {
        return progressList;
    }

   

}