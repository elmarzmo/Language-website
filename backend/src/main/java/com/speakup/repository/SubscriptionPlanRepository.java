package com.speakup.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.speakup.model.SubscriptionPlan;

public interface  SubscriptionPlanRepository extends MongoRepository<SubscriptionPlan, String> {

    Optional<SubscriptionPlan> findByIdAndActiveTrue(String id);

    
}
