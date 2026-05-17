package com.speakup.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "lessons")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LessonModule {

    @Id
    private String id;

    private String title;

    private String content;

    private String description;

    private String instructions;


    private String createdBy; // Teacher ID

    private LocalDateTime createdDate;

    private LocalDateTime updatedDate;

    private LessonStatus status = LessonStatus.DRAFT;


    private List<LessonResource> resources = new ArrayList<>();

    public enum LessonStatus {
        DRAFT,
        PUBLISHED,
        ARCHIVED
    }

}