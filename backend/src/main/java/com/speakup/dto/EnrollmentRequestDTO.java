package com.speakup.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentRequestDTO {
    
    private String planId;

    private String voucherCode; // Optional, can be null if no voucher is applied
}
