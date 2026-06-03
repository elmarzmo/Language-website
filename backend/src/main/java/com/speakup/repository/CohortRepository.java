package com.speakup.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.speakup.model.Cohort;
import com.speakup.model.CohortLevel;

public interface CohortRepository extends MongoRepository<Cohort, String> {

    List<Cohort> findByTeacherId(String teacherId);

    Optional<Cohort> findByStudentIdsContaining(String studentId);

    List<Cohort> findByActive(boolean active);

    List<Cohort> findByLevel(CohortLevel level);


}
    
