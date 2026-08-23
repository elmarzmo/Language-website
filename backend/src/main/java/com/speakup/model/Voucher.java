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
@Document(collection = "voucher")
public class Voucher {
    
    @Id
    private String id;

    private String code;

    private BigDecimal discountAmount;

    private LocalDateTime expirationDate;

    private boolean active;

    private int maxUses;

    private int usedCount;
}
