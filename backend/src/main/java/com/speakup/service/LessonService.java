package com.speakup.service;

import org.springframework.stereotype.Service;

import com.speakup.repository.LessonRepository;
import com.speakup.model.LessonModule;
import java.time.LocalDateTime;
import java.util.List;

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


    
}
 