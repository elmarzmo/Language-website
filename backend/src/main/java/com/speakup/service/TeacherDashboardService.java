package com.speakup.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.speakup.dto.ClassSessionDTO;
import com.speakup.dto.TeacherDashboardDTO;
import com.speakup.model.ClassSession;
import com.speakup.model.Cohort;
import com.speakup.repository.ClassSessionRepository;
import com.speakup.repository.CohortRepository;

@Service
public class TeacherDashboardService {

    private final CohortRepository cohortRepository;

    private final ClassSessionRepository classSessionRepository;
    
    private final ClassSessionService classSessionService;

    public TeacherDashboardService( CohortRepository cohortRepository, ClassSessionRepository classSessionRepository, ClassSessionService classSessionService) {

        this.cohortRepository = cohortRepository;
        this.classSessionRepository = classSessionRepository;
        this.classSessionService = classSessionService;


    }

    public TeacherDashboardDTO getTeacherDashboard(String teacherId) {

        classSessionService.updateCompletedSessions();;


        List<Cohort> cohorts = cohortRepository.findByTeacherId(teacherId);

        List<ClassSessionDTO> classes  = classSessionRepository
                .findByTeacherId(teacherId)
                .stream()
                .map(this::mapToDTO)
                .toList();

        int totalStudents = cohorts.stream().mapToInt(c -> c.getStudentIds().size()).sum();

        TeacherDashboardDTO dto = new TeacherDashboardDTO();

        dto.setUpcomingClasses(classes);
        dto.setCohortCount(cohorts.size());
        dto.setStudentCount(totalStudents);

        return dto;

    }
    

    private ClassSessionDTO mapToDTO(ClassSession session) {
        ClassSessionDTO dto = new ClassSessionDTO();


        dto.setId(session.getId());
        dto.setTeacherId(session.getTeacherId());
      
        dto.setLessonModuleId(session.getLessonModuleId());
        dto.setDateTime(session.getDateTime());
        dto.setDurationMinutes(session.getDurationMinutes());
        dto.setMeetingLink(session.getMeetingLink());
        dto.setStatus(session.getStatus().name());

        return dto;
    }
}
