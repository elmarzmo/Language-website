package com.speakup.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.speakup.dto.AddStudentRequest;
import com.speakup.dto.CohortDTO;
import com.speakup.dto.CreateCohortRequest;
import com.speakup.dto.UpdateCohortRequest;
import com.speakup.repository.CohortRepository;
import com.speakup.service.CohortService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/cohorts")
@PreAuthorize("hasRole('ADMIN')")
public class CohortController {
    private final CohortService cohortService;
    private final CohortRepository cohortRepository;

    public CohortController( CohortService cohortService, CohortRepository cohortRepository){
        this.cohortService = cohortService;
        this.cohortRepository = cohortRepository;
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
    public CohortDTO addStudent(@PathVariable String cohortId,
                                @RequestBody AddStudentRequest request){


        return cohortService.addStudent(cohortId, request.getStudentId());
    }

    @DeleteMapping("/{cohortId}/students/{studentId}")
    public CohortDTO removeStudent(@PathVariable String cohortId, @PathVariable String studentId){
        return cohortService.removeStudent(cohortId, studentId);
    }

    @GetMapping("/{cohortId}")
    public CohortDTO getCohortById(@PathVariable String cohortId){
        return cohortService.getCohortById(cohortId);
    }

    @PutMapping("/{cohortId}/update")
    public CohortDTO updateCohort(@PathVariable String cohortId, @Valid @RequestBody UpdateCohortRequest request){
        return cohortService.updateCohort(cohortId, request);
    }

    @DeleteMapping("/{cohortId}")
    public ResponseEntity<Void> deleteCohort(@PathVariable String cohortId){
        cohortService.deleteCohort(cohortId);
        return ResponseEntity.noContent().build();
    }


}
