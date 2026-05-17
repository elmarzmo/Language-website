package com.speakup.dto;

import java.time.LocalDate;

import com.speakup.model.CohortLevel;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateCohortRequest {
    
    @NotBlank(message = "Cohort name is required")
    private String name;



    @Min(value = 1, message = "Max student must be at least 1")
    @Max(value= 6, message= "Max student must be less then 6")
    private int maxStudents;

    @NotBlank(message = " Teacher Id is required")
    private String teacherId;

    @NotNull(message = " Start date is required")
    private LocalDate startDate;


    @NotNull(message="Cohort level is required")
    private CohortLevel level;

}
