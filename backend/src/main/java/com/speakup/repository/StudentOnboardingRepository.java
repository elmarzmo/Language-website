package com.speakup.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.speakup.model.StudentOnboarding;

public interface  StudentOnboardingRepository extends MongoRepository<StudentOnboarding, String>{
    
    Optional<StudentOnboarding> findByUserId(String userId);
}
