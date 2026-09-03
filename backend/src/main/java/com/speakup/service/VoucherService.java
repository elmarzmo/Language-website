package com.speakup.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.speakup.dto.VoucherValidationResponse;
import com.speakup.model.Voucher;
import com.speakup.repository.VoucherRepository;

@Service
public class VoucherService {
    private final VoucherRepository voucherRepository;

    public VoucherService(VoucherRepository voucherRepository) {
        this.voucherRepository = voucherRepository;
    }

    public VoucherValidationResponse validateVoucher(String code) {

        if(code == null || code.trim().isEmpty()) {
            return new VoucherValidationResponse(false, 
                "Voucher code cannot be empty.",
                 BigDecimal.ZERO);
        }

        String normalizedCode = code.trim().toUpperCase();

        Optional<Voucher> optionalVoucher = voucherRepository.findByCode(normalizedCode);

        if(optionalVoucher.isEmpty()) {
            return new VoucherValidationResponse(false, 
                "Voucher code does not exist.",
                 BigDecimal.ZERO);
        }

        Voucher voucher = optionalVoucher.get();

        if (voucher.getDiscountAmount().compareTo(new BigDecimal("29.99")) != 0) {
            return new VoucherValidationResponse(
                false,
                "This voucher is not valid for this subscription.",
                BigDecimal.ZERO
            );
        }

        if(!voucher.isActive()) {
            return new VoucherValidationResponse(false, 
                "Voucher code is not active.",
                 BigDecimal.ZERO);
        }

        if(voucher.getExpirationDate() != null && voucher.getExpirationDate().isBefore(LocalDateTime.now())) {
            return new VoucherValidationResponse(false, 
                "Voucher code has expired.",
                 BigDecimal.ZERO);
        }

        if(voucher.getMaxUses() > 0 && voucher.getUsedCount() >= voucher.getMaxUses()) {
            return new VoucherValidationResponse(false, 
                "Voucher code has reached its maximum usage limit.",
                 BigDecimal.ZERO);
        }

        return new VoucherValidationResponse(true, 
            "Voucher code is valid.",
             voucher.getDiscountAmount());
    }
}
