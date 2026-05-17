package com.speakup.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

import lombok.Data;

@Data
public class CreateCohortRequest {
    
    @NotBlank(message = "Cohort name is required")
    private String name;

    @NotBlank(message = "Level is required")
    private enum level {
        BEGINNER,
        IMTERMEDIATE,
        ADVANCE
    };

    @Min(value = 1, message = "Max student must be at least 1")
    @Max(value= 6, message= "Max student must be less then 6")
    private int maxStudents;

    @NotBlank(message = " Teacher Id is required")
    private String teacherId;

    @NotNull(message = " Start date is required")
    private LocalDate stratDate;


}
