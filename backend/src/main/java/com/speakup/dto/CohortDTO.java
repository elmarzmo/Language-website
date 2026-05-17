package com.speakup.dto;

import java.util.List;

import java.time.LocalDate;

import lombok.Data;

@Data
public class CohortDTO{

    private String id;

    private String name;

    private enum leve{
        BEGINNER,
        IMTERMEDIATE,
        ADVANCE
    }

    private int maxStudents;

    private String teacherId;

    private List<String> studentIds;

    private LocalDate startDate;

    private boolean active;

}