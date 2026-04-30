package com.speakup.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.speakup.model.LessonModule;

@Repository
public interface LessonRepository extends MongoRepository<LessonModule, String> {

    /**
     * Get all lessons created by a teacher
     */
    List<LessonModule> findByCreatedBy(String teacherId);

    /**
     * Get all published lessons created by a teacher
     */
    List<LessonModule> findByCreatedByAndStatus(String teacherId, LessonModule.LessonStatus status);

    /**
     * Get all lessons assigned to a student
     */
    @Query("{ 'assignedStudents': ?0 }")
    List<LessonModule> findLessonsByStudent(String studentId);

    /**
     * Get all published lessons assigned to a student
     */
    @Query("{ 'assignedStudents': ?0, 'status': 'PUBLISHED' }")
    List<LessonModule> findPublishedLessonsByStudent(String studentId);

    /**
     * Get a specific lesson
     */
    Optional<LessonModule> findById(String id);

    /**
     * Check if a lesson is assigned to a student
     */
    @Query("{ '_id': ?0, 'assignedStudents': ?1 }")
    Optional<LessonModule> findIfAssignedToStudent(String lessonId, String studentId);

    /**
     * Get all lessons
     */
    List<LessonModule> findAll();

    /**
     * Search lessons by title
     */
    List<LessonModule> findByTitleContainingIgnoreCase(String title);

    /**
     * Get all draft lessons for a teacher
     */
    List<LessonModule> findByCreatedByAndStatusOrderByCreatedDateDesc(String teacherId, LessonModule.LessonStatus status);

    /**
     * Get recent lessons for a student (limit results)
     */
    @Query("{ 'assignedStudents': ?0 }")
    List<LessonModule> findRecentLessonsByStudent(String studentId);

    /**
     * Find lessons by status
     */
    List<LessonModule> findByStatus(LessonModule.LessonStatus status);

    /**
     * Count lessons by teacher
     */
    long countByCreatedBy(String teacherId);

    /**
     * Delete all lessons by teacher
     */
    long deleteByCreatedBy(String teacherId);

}