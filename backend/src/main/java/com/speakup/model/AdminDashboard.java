package com.speakup.model;



public class AdminDashboard {
   
    private int lessonCount;
    private int classCount;

    // Default Constructor
    public AdminDashboard() {}

    // Getters and Setters
    public int getLessonCount() {
        return lessonCount;
    }

    public void setLessonCount(int lessonCount) {
        this.lessonCount = lessonCount;
    }

    public int getClassCount() {
        return classCount;
    }

    public void setClassCount(int classCount) {
        this.classCount = classCount;
    }

    // Add getters/setters for upcomingClasses as well

   

}