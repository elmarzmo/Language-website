package com.speakup.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.speakup.model.Cohort;

public interface CohortRespository extends MongoRepository<Cohort, String> {

    List<Cohort> findByTeacherId(String teacherId);

    List<Cohort> findByActive(boolean active);


}
    
