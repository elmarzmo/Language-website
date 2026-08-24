package com.speakup.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "subscription")
public class Subscription {
    
    @Id
    private String id;

    private String userId;

    private String planId;

    private String voucherId;

    private BigDecimal amount;

    private String currency;

    private SubscriptionStatus status;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    public enum SubscriptionStatus {
        ACTIVE,
        CANCELED,
        EXPIRED
    }
}
