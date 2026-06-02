package com.speakup.service;

import java.time.LocalDateTime;
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

    public TeacherDashboardService( CohortRepository cohortRepository, ClassSessionRepository classSessionRepository) {

        this.cohortRepository = cohortRepository;
        this.classSessionRepository = classSessionRepository;

    }

    public TeacherDashboardDTO getTeacherDashboard(String teacherId) {

        List<Cohort> cohorts = cohortRepository.findByTeacherId(teacherId);

        List<ClassSessionDTO> upcomingClasses = classSessionRepository
                .findByTeacherId(teacherId)
                .stream()
                .filter(session -> session.getDateTime()
                                            .isAfter(LocalDateTime.now()))
                .map(this::mapToDTO)
                .toList();

        int totalStudents = cohorts.stream().mapToInt(c -> c.getStudentIds().size()).sum();

        TeacherDashboardDTO dto = new TeacherDashboardDTO();

        dto.setUpcomingClasses(upcomingClasses);
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
