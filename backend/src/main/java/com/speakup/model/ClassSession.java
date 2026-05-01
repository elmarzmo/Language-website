package com.speakup.model;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "class_sessions")
@Data
public class ClassSession {

    @Id
    private String id;

    private String teacherId;

    private List<String> studentIds;

    private String lessonModuleId;

    private LocalDateTime dateTime;

    private int durationMinutes;

    private String meetingLink;

    private Status status = Status.SCHEDULED;

    public enum Status {
        SCHEDULED,
        ONGOING,
        COMPLETED,
        CANCELLED
    }



}