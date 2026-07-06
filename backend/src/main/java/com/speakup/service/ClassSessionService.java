package com.speakup.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.speakup.dto.ClassSessionDTO;
import com.speakup.dto.ClassSessionListDTO;
import com.speakup.dto.CreateClassSessionRequest;
import com.speakup.model.ClassSession;
import com.speakup.model.Cohort;
import com.speakup.repository.ClassSessionRepository;
import com.speakup.repository.CohortRepository;

@Service
public class ClassSessionService {

    private final ClassSessionRepository classSessionRepository;
    private final CohortRepository cohortRepository;

    public ClassSessionService(ClassSessionRepository classSessionRepository, CohortRepository cohortRepository) {
        this.classSessionRepository = classSessionRepository;
        this.cohortRepository = cohortRepository;
    }

    // Create, update, delete class sessions would go here (ADMIN)
    public ClassSessionDTO createSession(CreateClassSessionRequest request) {

        ClassSession session = new ClassSession();


    // later you will fetch real names:
    // dto.setTeacherName(user.getUsername())
    // dto.setCohortName(cohort.getName())
    // dto.setLessonModuleTitle(lesson.getTitle())

        session.setTeacherId(request.getTeacherId());
        session.setCohortId(request.getCohortId());
      //  session.setStudentIds(request.getStudentIds());
       
        session.setLessonModuleId(request.getLessonModuleId());
        session.setDateTime(request.getDateTime());
        session.setDurationMinutes(request.getDurationMinutes());
        session.setMeetingLink(request.getMeetingLink());
        session.setStatus(ClassSession.Status.SCHEDULED);

        ClassSession saved = classSessionRepository.save(session);

        return mapToDTO(saved);
    }

    // Get by student
    /* 
    public List<ClassSessionDTO> getSessionsByStudent(String studentId) {
        return classSessionRepository.findByStudentIdsContaining(studentId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    */

    // Get by teacher
    public List<ClassSessionDTO> getSessionsByTeacher(String teacherId) {
        return classSessionRepository.findByTeacherId(teacherId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // update status
    public ClassSessionDTO updateStatus(String sessionId,String status) {
        ClassSession session = classSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));  

        try{
        session.setStatus(ClassSession.Status.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid session status");
        }
        return mapToDTO(classSessionRepository.save(session));
    }

    public List<ClassSessionDTO> getAllSessions() {
        return classSessionRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    public List<ClassSessionListDTO> getAllClassSessions(){
        return classSessionRepository.findAll()
                .stream()
                .map(this::mapToClassListDTO)
                .collect(Collectors.toList());
    }
    
    public void deleteSession(String sessionId) {
        classSessionRepository.deleteById(sessionId);
    }

    public ClassSessionDTO updateMeetingLink(String currentTeacherId, String sessionId, String meetingLink) {
        ClassSession session = classSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
       

        if (meetingLink == null || meetingLink.trim().isEmpty()) {
            throw new RuntimeException("Meeting link cannot be empty");
        }

        if (!meetingLink.startsWith("http://") && !meetingLink.startsWith("https://")) {
            throw new RuntimeException("Invalid meeting link format. It should start with http:// or https://");
        }

        if (!session.getTeacherId().equals(currentTeacherId)) {
            throw new RuntimeException("You are not authorized to update this session's meeting link");
        }
        
        session.setMeetingLink(meetingLink);

        ClassSession saved = classSessionRepository.save(session);

       
        return mapToDTO(saved);

    }

public void updateCompletedSessions() {

    LocalDateTime now = LocalDateTime.now();

    List<ClassSession> sessions = classSessionRepository.findAll();

    for(ClassSession session : sessions) {

        LocalDateTime start = session.getDateTime();

        LocalDateTime end = start.plusMinutes(
                session.getDurationMinutes()
        );


        if(now.isAfter(end) &&
           session.getStatus() != ClassSession.Status.COMPLETED) {

            session.setStatus(ClassSession.Status.COMPLETED);
            classSessionRepository.save(session);

        }
        else if(now.isAfter(start)
                && now.isBefore(end)
                && session.getStatus() == ClassSession.Status.SCHEDULED) {

            session.setStatus(ClassSession.Status.ONGOING);
            classSessionRepository.save(session);
        }
    }
}



    // mapper
    private ClassSessionDTO mapToDTO(ClassSession session) {
        ClassSessionDTO dto = new ClassSessionDTO();

        dto.setId(session.getId());
        dto.setTeacherId(session.getTeacherId());
       
        dto.setCohortId(session.getCohortId());
        dto.setLessonModuleId(session.getLessonModuleId());
        dto.setDateTime(session.getDateTime());
        dto.setDurationMinutes(session.getDurationMinutes());
        dto.setMeetingLink(session.getMeetingLink());
        dto.setStatus(session.getStatus().name());

        return dto;
    }

    // NEW: Distinct mapper targeting the admin list DTO structure
    private ClassSessionListDTO mapToClassListDTO(ClassSession session) {

         System.out.println("Session ID: " + session.getId());
            System.out.println("Cohort ID: " + session.getCohortId());

        ClassSessionListDTO dto = new ClassSessionListDTO();
        
        dto.setId(session.getId());
        dto.setDateTime(session.getDateTime());
        dto.setDurationMinutes(session.getDurationMinutes());
        dto.setMeetingLink(session.getMeetingLink());
        dto.setStatus(session.getStatus().name());
        
        // TODO: Inject your respective services/repositories to fetch real values by ID
        // e.g., String teacherName = userRepository.findNameById(session.getTeacherId());
        dto.setTeacherName("Teacher ID: " + session.getTeacherId()); 
        dto.setCohortName("Cohort ID: " + session.getCohortId());
        dto.setLessonModuleTitle("Lesson ID: " + session.getLessonModuleId());
        
       Cohort cohort = cohortRepository.findById(session.getCohortId())
                .orElse(null);

        if(cohort != null) {
            dto.setCohortName(cohort.getName());

            dto.setEnrolledStudentCount(
                cohort.getStudentIds() == null ? 0 : cohort.getStudentIds().size());
        } else {
        
            dto.setCohortName("Unknown");
            dto.setEnrolledStudentCount(0);

        }

        return dto;
    }
}
