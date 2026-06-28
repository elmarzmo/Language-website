package com.speakup.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.speakup.dto.ClassSessionDTO;
import com.speakup.dto.ClassSessionListDTO;
import com.speakup.dto.CohortDTO;
import com.speakup.dto.TeacherDashboardDTO;
import com.speakup.dto.UpdateCohortRequest;
import com.speakup.dto.UpdateMeetingLinkRequest;
import com.speakup.model.LessonModule;
import com.speakup.service.ClassSessionService;
import com.speakup.service.CohortService;
import com.speakup.service.LessonService;
import com.speakup.service.TeacherDashboardService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/teacher")
public class TeacherController {

    private final TeacherDashboardService teacherDashboardService;
    private final LessonService lessonService;
    private final CohortService cohortService;
    private final ClassSessionService classSessionService;

    public TeacherController(TeacherDashboardService teacherDashboardService, LessonService lessonService, CohortService cohortService, ClassSessionService classSessionService){

        this.teacherDashboardService = teacherDashboardService;
        this.lessonService = lessonService;
        this.cohortService = cohortService;
        this.classSessionService = classSessionService;
    }

    @GetMapping("/dashboard")
    public TeacherDashboardDTO getTeacherDashboar(HttpServletRequest request) {

        String teacherId = (String) request.getAttribute("userId");

        return teacherDashboardService.getTeacherDashboard(teacherId);
    }
    

    @GetMapping("/resources")
    public ResponseEntity<List<LessonModule>> getTeacherLessons(){
        List<LessonModule> lessons = lessonService.getAllLessons();
        return ResponseEntity.ok(lessons);
    }

    // Get teacher sessions
    @GetMapping("/sessions")
    public List<ClassSessionDTO> getSessionsByTeacher(HttpServletRequest request) {
        String teacherId = (String) request.getAttribute("userId");

        return classSessionService.getSessionsByTeacher(teacherId);
    }

     @GetMapping("/sessions/all")
    public List<ClassSessionListDTO> getAllClassSessions(HttpServletRequest request) {
      

        return classSessionService.getAllClassSessions();
    }

    @DeleteMapping("/sessions/{sessionId}")
    public ResponseEntity<Void> deleteClassSession(@PathVariable String sessionId) {

        classSessionService.deleteSession(sessionId);
        return ResponseEntity.noContent().build();
    }




    // Update session status
    @PutMapping("/sessions/{sessionId}/meeting-link")
    public ClassSessionDTO updateMeetingLink(
            @PathVariable String sessionId,
            @RequestBody UpdateMeetingLinkRequest request) {
        return classSessionService.updateMeetingLink(sessionId, request.getMeetingLink());
    }


     @GetMapping("/cohorts")
    public List<CohortDTO> getTeacherCohorts(HttpServletRequest request){
        String teacherId = (String) request.getAttribute("userId");
        return cohortService.getTeacherCohorts(teacherId);
    }

    @PutMapping("/cohorts/{cohortId}/update")
    public CohortDTO updateCohort(@PathVariable String cohortId, @Valid @RequestBody UpdateCohortRequest request){
        return cohortService.updateCohort(cohortId, request);
    }
}
