package com.speakup.repository;

import com.speakup.model.ClassSession;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ClassSessionRepository extends MongoRepository<ClassSession, String> {

    List<ClassSession> findByStudentIdsContains(String studentId);

    List<ClassSession> findByTeacherId(String teacherId);
}