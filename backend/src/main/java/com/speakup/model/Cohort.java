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



    private int maxStudents;

    private String teacherId;

    private List<String> studentIds = new ArrayList<>();

    private LocalDate startDate;

    private boolean active = true;


    private CohortLevel level;

    public CohortLevel getLevel() {
        return level;
    }
    public void setLevel(CohortLevel level){
        this.level = level;
    }
}
