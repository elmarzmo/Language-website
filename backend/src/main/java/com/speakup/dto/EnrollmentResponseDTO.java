package com.speakup.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.speakup.model.Subscription.SubscriptionStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentResponseDTO {

    private String subscriptionId;

    private String planId;

    private BigDecimal amount;

    private String currency;

    private SubscriptionStatus status;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    private boolean voucherApplied;
    
}
