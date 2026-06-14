package com.speakup.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.speakup.dto.ClassSessionDTO;
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

        session.setTeacherId(request.getTeacherId());
       
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
    
    public void deleteSession(String sessionId) {
        classSessionRepository.deleteById(sessionId);
    }
    

    // mapper
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
