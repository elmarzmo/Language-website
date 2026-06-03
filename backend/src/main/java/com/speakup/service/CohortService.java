package com.speakup.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.speakup.dto.CohortDTO;
import com.speakup.dto.CreateCohortRequest;
import com.speakup.model.Cohort;
import com.speakup.repository.CohortRepository;



@Service
public class CohortService {
    private final CohortRepository cohortRepository;

    public CohortService(CohortRepository cohortRespository) {
        this.cohortRepository = cohortRespository;
    } 


    public CohortDTO createCohort(CreateCohortRequest request){
        Cohort cohort = new Cohort();

        cohort.setName(request.getName());
       cohort.setLevel(request.getLevel());
       cohort.setMaxStudents(request.getMaxStudents());
       cohort.setTeacherId(request.getTeacherId());
       cohort.setStartDate(request.getStartDate());
       cohort.setActive(true);

       Cohort saved = cohortRepository.save(cohort);

       return mapToDTO(saved);
    }

    public List<CohortDTO> getAllCohorts(){
        return cohortRepository.findAll()
            .stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }

    public List<CohortDTO> getTeacherCohorts(String teacherId){
        return cohortRepository.findByTeacherId(teacherId)
            .stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }

    public CohortDTO addStudent(String cohortId, String studentId){
        Cohort cohort = cohortRepository.findById(cohortId)
            .orElseThrow(() -> new RuntimeException("Cohort not found"));

        if(cohort.getStudentIds().size() >= cohort.getMaxStudents()){
            throw new RuntimeException("Cohort is full");
        }

        if(!cohort.getStudentIds().contains(studentId)) {
            cohort.getStudentIds().add(studentId);
        }

        return mapToDTO(cohortRepository.save(cohort));
    }

    public CohortDTO removeStudent(String cohortId, String studentId){
        Cohort cohort = cohortRepository.findById(cohortId)
            .orElseThrow(() -> new RuntimeException("Cohort not found"));

        cohort.getStudentIds().remove(studentId);

        return mapToDTO(cohortRepository.save(cohort));
    }

    public CohortDTO getCohortById(String cohortId){
        Cohort cohort = cohortRepository.findById(cohortId)
            .orElseThrow(() -> new RuntimeException("Cohort not found"));

        return mapToDTO(cohort);
    }
    
    public CohortDTO getCohortByStudentId(String studentId){
        Cohort cohort = cohortRepository.findByStudentIdsContaining(studentId)
            .orElseThrow(() -> new RuntimeException("Cohort not found for student"));
           

        return mapToDTO(cohort);
    }



    
    private CohortDTO mapToDTO(Cohort cohort){
        CohortDTO dto = new CohortDTO();

        dto.setId(cohort.getId());
        dto.setName(cohort.getName());
        dto.setLevel(cohort.getLevel());
        dto.setMaxStudents(cohort.getMaxStudents());
        dto.setTeacherId(cohort.getTeacherId());
        dto.setStudentIds(cohort.getStudentIds());
        dto.setStartDate(cohort.getStartDate());
        dto.setActive(cohort.isActive());

        return dto;

    }
}
