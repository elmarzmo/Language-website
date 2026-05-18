package com.speakup.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.speakup.dto.CohortDTO;
import com.speakup.dto.CreateCohortRequest;
import com.speakup.service.CohortService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/cohorts")
@CrossOrigin
public class CohortController {
    private final CohortService cohortService;

    public CohortController( CohortService cohortService){
        this.cohortService = cohortService;
    }

    @PostMapping
    public CohortDTO createCohort( @Valid @RequestBody CreateCohortRequest request) {
        return cohortService.createCohort(request);
    }

    @GetMapping
    public List<CohortDTO> getAllCohorts(){
        return cohortService.getAllCohorts();
    }

    @GetMapping("/teacher/{teacherId}")
    public List<CohortDTO> getTeacherCohoList( @PathVariable String teacherId){
        return cohortService.getTeacherCohorts(teacherId);
    }

    @PostMapping("/{cohortId}/students")
    public CohortDTO addStudent(@PathVariable String cohortId, String studentId){

        return cohortService.addStudent(cohortId, studentId);
    }
}
