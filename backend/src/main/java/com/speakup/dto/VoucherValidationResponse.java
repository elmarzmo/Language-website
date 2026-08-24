package com.speakup.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VoucherValidationResponse {
    
    private boolean valid;

    private String message;

    private BigDecimal discountAmount;
}
