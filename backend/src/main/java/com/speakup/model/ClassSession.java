package com.speakup.model;

import lombok.Data;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.web.filter.OncePerRequestFilter;

@Document(collection = "class_sessions")
@Data
public class ClassSession {

    @Id
    private String id;

    private String teacherId;

    private List<String> studentIds;

    private String lessonMosduleId;

    private LocalDateTime dateTime;

    private int durationMinutes;

    private String meetingLink;

    private Status status = Status.SCHEDULED;

    public enum Status {
        SCHEDULED,
        ONGOUNG,
        COMPLETED,
        CANCELLED
    }



}