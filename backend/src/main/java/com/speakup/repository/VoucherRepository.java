package com.speakup.repository;



import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.speakup.model.Voucher;

public interface VoucherRepository extends MongoRepository<Voucher, String> {
    
    Optional<Voucher> findByCode(String code);
    
}
