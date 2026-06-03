package com.speakup.service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.speakup.dto.ClassSessionDTO;
import com.speakup.dto.CohortDTO;
import com.speakup.dto.StudentDashboardDTO;
import com.speakup.model.ClassSession;
import com.speakup.model.StudentProgress;
import com.speakup.repository.ClassSessionRepository;
import com.speakup.repository.StudentProgressRepository;

@Service
public class StudentDashboardService {

    private final ClassSessionRepository classSessionRepository;
    private final StudentProgressRepository studentProgressRepository;
    private final CohortService cohortService;


    public StudentDashboardService(ClassSessionRepository classSessionRepository,
         StudentProgressRepository studentProgressRepository,
         CohortService cohortService) {
        this.classSessionRepository = classSessionRepository;
        this.studentProgressRepository = studentProgressRepository;
        this.cohortService = cohortService;
    }

 
    public StudentDashboardDTO getStudentDashboard(String studentId) {

        CohortDTO studentCohort = cohortService.getCohortByStudentId(studentId);


        List<ClassSessionDTO> classes = classSessionRepository
            .findByCohortId(studentCohort.getId())
            .stream()
            .filter(session -> session.getDateTime().isAfter(LocalDateTime.now()) && session.getStatus() == ClassSession.Status.SCHEDULED)
            .map(this::mapToDTO)
            .collect(Collectors.toList());

    List<StudentProgress> progresses = studentProgressRepository.findByStudentId(studentId);

    StudentDashboardDTO dto = new StudentDashboardDTO();
    dto.setUpcomingClasses(classes);
    dto.setProgressList(progresses);

    return dto;
}

public void markLessonAsComplete(String studentId, String lessonId){
    StudentProgress progress = studentProgressRepository
        .findByStudentIdAndLessonModuleId(studentId, lessonId)
        .orElse(new StudentProgress());


    progress.setStudentId(studentId);
    progress.setLessonModuleId(lessonId);
    progress.setCompleted(true);
    progress.setProgressPercentage(100);
    progress.setLastUpdated(Instant.now());

    studentProgressRepository.save(progress);
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
