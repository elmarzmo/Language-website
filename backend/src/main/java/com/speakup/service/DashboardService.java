package com.speakup.service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.speakup.dto.ClassSessionDTO;
import com.speakup.dto.StudentDashboardDTO;
import com.speakup.model.StudentProgress;
import com.speakup.repository.ClassSessionRepository;
import com.speakup.repository.StudentProgressRepository;

@Service
public class DashboardService {

    private final ClassSessionRepository classSessionRepository;
    private final StudentProgressRepository studentProgressRepository;

    public DashboardService(ClassSessionRepository classSessionRepository, StudentProgressRepository studentProgressRepository) {
        this.classSessionRepository = classSessionRepository;
        this.studentProgressRepository = studentProgressRepository;
    }

    public StudentDashboardDTO getStudentDashboard(String studentId) {
        List<ClassSessionDTO> classes = classSessionRepository
            .findByStudentIdsContaining(studentId)
            .stream()
            .filter(session -> session.getDateTime().isAfter(LocalDateTime.now()) && session.getStatus() == com.speakup.model.ClassSession.Status.SCHEDULED)
            .map(session -> {
                ClassSessionDTO dto = new ClassSessionDTO();
                dto.setId(session.getId());
                dto.setTeacherId(session.getTeacherId());
                dto.setStudentIds(session.getStudentIds());
                dto.setLessonModuleId(session.getLessonModuleId());
                dto.setDateTime(session.getDateTime());
                dto.setDurationMinutes(session.getDurationMinutes());
                dto.setMeetingLink(session.getMeetingLink());
                dto.setStatus(session.getStatus().name());
                return dto;
            })
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
}
