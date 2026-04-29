package com.speakup.controller;

import com.speakup.model.LessonModule;
import com.speakup.model.LessonResource;
import com.speakup.model.LiveClass;
import com.speakup.repository.LessonRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/lessons")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class LessonController {

    @Autowired
    private LessonRepository lessonRepository;

    // ============ STUDENT ENDPOINTS ============

    /**
     * GET /api/lessons/student/{studentId}
     * Get all lessons assigned to a student
     */
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<LessonModule>> getStudentLessons(@PathVariable String studentId) {
        try {
            List<LessonModule> lessons = lessonRepository.findLessonsByStudent(studentId);
            // Sort by created date descending (newest first)
            lessons.sort((a, b) -> b.getCreatedDate().compareTo(a.getCreatedDate()));
            return ResponseEntity.ok(lessons);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/lessons/{lessonId}
     * Get a specific lesson with all resources
     */
    @GetMapping("/{lessonId}")
    public ResponseEntity<LessonModule> getLesson(@PathVariable String lessonId) {
        try {
            Optional<LessonModule> lesson = lessonRepository.findById(lessonId);
            return lesson.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/lessons/student/{studentId}/classes/upcoming
     * Get upcoming live classes for a student
     */
    @GetMapping("/student/{studentId}/classes/upcoming")
    public ResponseEntity<List<LiveClass>> getUpcomingClasses(@PathVariable String studentId) {
        try {
            List<LessonModule> lessons = lessonRepository.findLessonsByStudent(studentId);
            List<LiveClass> upcomingClasses = lessons.stream()
                    .map(LessonModule::getLiveClass)
                    .filter(liveClass -> liveClass != null &&
                            (liveClass.getStatus() == LiveClass.ClassStatus.SCHEDULED ||
                             liveClass.getStatus() == LiveClass.ClassStatus.ONGOING))
                    .sorted((a, b) -> a.getScheduledDate().compareTo(b.getScheduledDate()))
                    .collect(Collectors.toList());
            return ResponseEntity.ok(upcomingClasses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * POST /api/lessons/{lessonId}/resources/{resourceId}/view
     * Mark a resource as viewed by student
     */
    @PostMapping("/{lessonId}/resources/{resourceId}/view")
    public ResponseEntity<Map<String, String>> markResourceViewed(
            @PathVariable String lessonId,
            @PathVariable String resourceId,
            @RequestBody Map<String, String> body) {
        try {
            String studentId = body.get("studentId");
            
            // Verify student has access to lesson
            Optional<LessonModule> lesson = lessonRepository.findIfAssignedToStudent(lessonId, studentId);
            if (lesson.isEmpty()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            Map<String, String> response = new HashMap<>();
            response.put("message", "Resource marked as viewed");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * POST /api/lessons/classes/{classId}/join
     * Join a live class - returns meeting link
     */
    @PostMapping("/classes/{classId}/join")
    public ResponseEntity<Map<String, String>> joinClass(@PathVariable String classId) {
        try {
            Map<String, String> response = new HashMap<>();
            response.put("meetingLink", "https://meet.google.com/abc-defg-hij");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ============ TEACHER ENDPOINTS ============

    /**
     * POST /api/lessons
     * Create a new lesson
     */
    @PostMapping
    public ResponseEntity<LessonModule> createLesson(@RequestBody LessonModule lesson) {
        try {
            lesson.setId(new ObjectId().toString());
            lesson.prePersist();
            LessonModule savedLesson = lessonRepository.save(lesson);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedLesson);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * PUT /api/lessons/{lessonId}
     * Update an existing lesson
     */
    @PutMapping("/{lessonId}")
    public ResponseEntity<LessonModule> updateLesson(
            @PathVariable String lessonId,
            @RequestBody LessonModule lessonUpdates) {
        try {
            Optional<LessonModule> existingLesson = lessonRepository.findById(lessonId);
            if (existingLesson.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            LessonModule lesson = existingLesson.get();
            
            // Update fields
            if (lessonUpdates.getTitle() != null) lesson.setTitle(lessonUpdates.getTitle());
            if (lessonUpdates.getDescription() != null) lesson.setDescription(lessonUpdates.getDescription());
            if (lessonUpdates.getStatus() != null) lesson.setStatus(lessonUpdates.getStatus());
            if (lessonUpdates.getCompletionPercentage() != null) lesson.setCompletionPercentage(lessonUpdates.getCompletionPercentage());
            if (lessonUpdates.getLiveClass() != null) lesson.setLiveClass(lessonUpdates.getLiveClass());
            if (lessonUpdates.getResources() != null) lesson.setResources(lessonUpdates.getResources());
            if (lessonUpdates.getAssignedStudents() != null) lesson.setAssignedStudents(lessonUpdates.getAssignedStudents());

            lesson.preUpdate();
            LessonModule updatedLesson = lessonRepository.save(lesson);
            return ResponseEntity.ok(updatedLesson);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * DELETE /api/lessons/{lessonId}
     * Delete a lesson
     */
    @DeleteMapping("/{lessonId}")
    public ResponseEntity<Map<String, String>> deleteLesson(@PathVariable String lessonId) {
        try {
            if (!lessonRepository.existsById(lessonId)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            lessonRepository.deleteById(lessonId);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Lesson deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * POST /api/lessons/{lessonId}/resources
     * Add a resource to a lesson
     */
    @PostMapping("/{lessonId}/resources")
    public ResponseEntity<LessonResource> addResource(
            @PathVariable String lessonId,
            @RequestBody LessonResource resource) {
        try {
            Optional<LessonModule> lesson = lessonRepository.findById(lessonId);
            if (lesson.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            // Set resource ID if not provided
            if (resource.getId() == null) {
                resource.setId(new ObjectId().toString());
            }
            if (resource.getUploadedDate() == null) {
                resource.setUploadedDate(LocalDateTime.now());
            }

            lesson.get().getResources().add(resource);
            lessonRepository.save(lesson.get());

            return ResponseEntity.status(HttpStatus.CREATED).body(resource);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * DELETE /api/lessons/{lessonId}/resources/{resourceId}
     * Delete a resource
     */
    @DeleteMapping("/{lessonId}/resources/{resourceId}")
    public ResponseEntity<Map<String, String>> deleteResource(
            @PathVariable String lessonId,
            @PathVariable String resourceId) {
        try {
            Optional<LessonModule> lesson = lessonRepository.findById(lessonId);
            if (lesson.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            lesson.get().getResources().removeIf(r -> r.getId().equals(resourceId));
            lessonRepository.save(lesson.get());

            Map<String, String> response = new HashMap<>();
            response.put("message", "Resource deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * POST /api/lessons/{lessonId}/classes
     * Schedule a live class for a lesson
     */
    @PostMapping("/{lessonId}/classes")
    public ResponseEntity<LiveClass> scheduleLiveClass(
            @PathVariable String lessonId,
            @RequestBody LiveClass liveClass) {
        try {
            Optional<LessonModule> lesson = lessonRepository.findById(lessonId);
            if (lesson.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            if (liveClass.getId() == null) {
                liveClass.setId(new ObjectId().toString());
            }
            liveClass.prePersist();

            lesson.get().setLiveClass(liveClass);
            lessonRepository.save(lesson.get());

            return ResponseEntity.status(HttpStatus.CREATED).body(liveClass);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * PUT /api/lessons/{lessonId}/classes/{classId}
     * Update a live class
     */
    @PutMapping("/{lessonId}/classes/{classId}")
    public ResponseEntity<LiveClass> updateLiveClass(
            @PathVariable String lessonId,
            @PathVariable String classId,
            @RequestBody LiveClass classUpdates) {
        try {
            Optional<LessonModule> lesson = lessonRepository.findById(lessonId);
            if (lesson.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            LiveClass existingClass = lesson.get().getLiveClass();
            if (existingClass == null || !existingClass.getId().equals(classId)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            // Update fields
            if (classUpdates.getTitle() != null) existingClass.setTitle(classUpdates.getTitle());
            if (classUpdates.getScheduledDate() != null) existingClass.setScheduledDate(classUpdates.getScheduledDate());
            if (classUpdates.getScheduledTime() != null) existingClass.setScheduledTime(classUpdates.getScheduledTime());
            if (classUpdates.getDuration() != null) existingClass.setDuration(classUpdates.getDuration());
            if (classUpdates.getMeetingLink() != null) existingClass.setMeetingLink(classUpdates.getMeetingLink());
            if (classUpdates.getStatus() != null) existingClass.setStatus(classUpdates.getStatus());
            if (classUpdates.getRecordingLink() != null) existingClass.setRecordingLink(classUpdates.getRecordingLink());

            existingClass.preUpdate();
            lessonRepository.save(lesson.get());

            return ResponseEntity.ok(existingClass);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * POST /api/lessons/{lessonId}/publish
     * Publish a lesson to students
     */
    @PostMapping("/{lessonId}/publish")
    public ResponseEntity<Map<String, String>> publishLesson(
            @PathVariable String lessonId,
            @RequestBody Map<String, Object> body) {
        try {
            Optional<LessonModule> lesson = lessonRepository.findById(lessonId);
            if (lesson.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            lesson.get().setStatus(LessonModule.LessonStatus.PUBLISHED);
            
            // Assign to students if provided
            @SuppressWarnings("unchecked")
            List<String> studentIds = (List<String>) body.get("studentIds");
            if (studentIds != null) {
                lesson.get().setAssignedStudents(studentIds);
            }

            lesson.get().preUpdate();
            lessonRepository.save(lesson.get());

            Map<String, String> response = new HashMap<>();
            response.put("message", "Lesson published successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/lessons/teacher/{teacherId}
     * Get all lessons created by a teacher
     */
    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<List<LessonModule>> getTeacherLessons(@PathVariable String teacherId) {
        try {
            List<LessonModule> lessons = lessonRepository.findByCreatedBy(teacherId);
            lessons.sort((a, b) -> b.getCreatedDate().compareTo(a.getCreatedDate()));
            return ResponseEntity.ok(lessons);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/lessons/search?title=
     * Search lessons by title
     */
    @GetMapping("/search")
    public ResponseEntity<List<LessonModule>> searchLessons(@RequestParam String title) {
        try {
            List<LessonModule> lessons = lessonRepository.findByTitleContainingIgnoreCase(title);
            return ResponseEntity.ok(lessons);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}