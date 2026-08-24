package com.speakup.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.speakup.model.Subscription;

public interface SubscriptionRepository extends MongoRepository<Subscription, String> {
    
    Optional<Subscription> findByUserId(String userId);

    Optional<Subscription> findByUserIdAndStatus(String userId, Subscription.SubscriptionStatus status);
}
