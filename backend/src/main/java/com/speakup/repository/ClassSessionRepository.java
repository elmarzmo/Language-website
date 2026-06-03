package com.speakup.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.speakup.model.ClassSession;

public interface ClassSessionRepository extends MongoRepository<ClassSession, String> {

    
    List<ClassSession> findByCohortId(String cohortId);
    
    List<ClassSession> findByTeacherId(String teacherId);
}