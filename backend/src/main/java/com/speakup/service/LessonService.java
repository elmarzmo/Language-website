package com.speakup.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.speakup.model.LessonModule;
import com.speakup.repository.LessonRepository;

@Service
public class LessonService {
    private final LessonRepository lessonRepository;

    public LessonService(LessonRepository lessonRepository) {
        this.lessonRepository = lessonRepository;
    }

    // create lesson (ADMIN)
    public LessonModule createLesson(LessonModule lesson) {
        // set timestamps
        lesson.setCreatedDate(LocalDateTime.now());
        lesson.setUpdatedDate(LocalDateTime.now());

        // default status
        if (lesson.getStatus() == null) {
            lesson.setStatus(LessonModule.LessonStatus.DRAFT);
        }
        return lessonRepository.save(lesson);
    }

    // get all lessons (ADMIN)
    public List<LessonModule> getAllLessons() {
        return lessonRepository.findAll();
    }

    // get only published lessons (STUDENT)
    public List<LessonModule> getPublishedLessons() {
        return lessonRepository.findByStatus(LessonModule.LessonStatus.PUBLISHED);
    }

    public void deleteLesson(String id){
        
        lessonRepository.deleteById(id);
    }

    public LessonModule getLessonById( String id) {
        return lessonRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Lesson not found"));
    } 

    public LessonModule updateLesson(String id, LessonModule updatedLesson) {
        updatedLesson.setId(id);
        return lessonRepository.save(updatedLesson);
    }
    
}
 