package com.speakup.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.speakup.dto.VoucherDTO;
import com.speakup.dto.VoucherValidationResponse;
import com.speakup.service.VoucherService;

@RestController
@RequestMapping("/api/voucher")
public class VoucherController {
    private final VoucherService voucherService;

    public VoucherController(VoucherService voucherService) {
        this.voucherService = voucherService;
    }

    @PostMapping("/validate")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<VoucherValidationResponse> validateVoucher(
        @RequestBody VoucherDTO dto) {

        VoucherValidationResponse response =
         voucherService.validateVoucher(dto.getCode());

        return ResponseEntity.ok(response);
    }


    
}
