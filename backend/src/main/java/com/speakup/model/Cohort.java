package com.speakup.model;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection= "cohorts")
@Data
public class Cohort {
    @Id
    private String id;

    private String name;

    private enum level {
        BEGINNER,
        IMTERMEDIATE,
        ADVANCE
    };

    private int maxStudents;

    private String teavherId;

    private List<String> studentIds = new ArrayList<>();

    private LocalDate startDate;

    private boolean active = true;
}
