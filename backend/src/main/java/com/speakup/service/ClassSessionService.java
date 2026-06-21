package com.speakup.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.speakup.dto.ClassSessionDTO;
import com.speakup.dto.ClassSessionListDTO;
import com.speakup.dto.CreateClassSessionRequest;
import com.speakup.model.ClassSession;
import com.speakup.repository.ClassSessionRepository;

@Service
public class ClassSessionService {

    private final ClassSessionRepository classSessionRepository;

    public ClassSessionService(ClassSessionRepository classSessionRepository) {
        this.classSessionRepository = classSessionRepository;
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

    public ClassSessionDTO updateMeetingLink(String sessionId, String meetingLink) {
        ClassSession session = classSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
       
        session.setMeetingLink(meetingLink);

        ClassSession saved = classSessionRepository.save(session);

       
        return mapToDTO(saved);

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
        
        // Mocking student count until collection fields are ready
        dto.setEnrolledStudentCount(0); 

        return dto;
    }
}
