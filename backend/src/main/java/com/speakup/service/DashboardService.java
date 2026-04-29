package com.speakup.service;

import com.speakup.dto.StudentDashboardDTO;
import com.speakup.model.ClassSession;
import com.speakup.model.StudentProgress;
import com.speakup.repository.ClassSessionRepository;
import com.speakup.repository.StudentProgressRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DashboardService {

    private final ClassSessionRepository classSessionRepository;
    private final StudentProgressRepository studentProgressRepository;

    public DashboardService(ClassSessionRepository classSessionRepository, StudentProgressRepository studentProgressRepository) {
        this.classSessionRepository = classSessionRepository;
        this.studentProgressRepository = studentProgressRepository;
    }

    public StudentDashboardDTO getStudentDashboard(String studentId) {
        List<ClassSession> classes = classSessionRepository.findByStudentIdsContains(studentId);
        List<StudentProgress> progresses = studentProgressRepository.findByStudentId(studentId);

        StudentDashboardDTO dashboardDTO = new StudentDashboardDTO();
        dashboardDTO.setUpcomingClasses(classes);
        dashboardDTO.setProgressList(progresses);

        return dashboardDTO;
    }
}
