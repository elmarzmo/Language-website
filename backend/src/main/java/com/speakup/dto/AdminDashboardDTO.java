package com.speakup.dto;

import java.util.List;

public class AdminDashboardDTO {

    private List<ClassSessionDTO> allClasses;
  
    private int lessonCount;
    private int classCount;

    public AdminDashboardDTO() {}

    // Getters and Setters
    public List<ClassSessionDTO> getAllClasses() { return allClasses; }
    public void setAllClasses(List<ClassSessionDTO> allClasses) { this.allClasses = allClasses; }

    
    public int getLessonCount() { return lessonCount; }
    public void setLessonCount(int lessonCount) { this.lessonCount = lessonCount; }

    public int getClassCount() { return classCount; }
    public void setClassCount(int classCount) { this.classCount = classCount; }

     
   
}
