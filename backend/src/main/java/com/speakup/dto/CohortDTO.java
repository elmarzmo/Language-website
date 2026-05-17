package com.speakup.dto;

import java.time.LocalDate;
import java.util.List;

import com.speakup.model.CohortLevel;

import lombok.Data;

@Data
public class CohortDTO{

    private String id;

    private String name;

    

    private int maxStudents;

    private String teacherId;

    private List<String> studentIds;

    private LocalDate startDate;

    private boolean active;

    private CohortLevel level;

}