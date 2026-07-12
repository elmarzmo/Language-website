package com.speakup.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import lombok.Data;

@Data
public class ResetPasswordRequest {
    @NotBlank
    private String resetToken;

    @Size(min = 6, message = "Password must be at least 6 characters long")
    @NotBlank(message = "New password is required")
    private String newPassword;
}
