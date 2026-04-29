package com.speakup.repository;

import com.speakup.model.StudentProgress;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface StudentProgressRepository extends MongoRepository<StudentProgress, String> {

    List<StudentProgress> findByStudentId(String studentId);

    Optional<StudentProgress> findByStudentIdAndLessonModuleId(String studentId, String lessonModuleId);
}