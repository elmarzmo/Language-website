package com.speakup.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateCohortRequest {
    @NotBlank(message = "Cohort name is required")
    private String name;

    private String teacherId;
    
}
