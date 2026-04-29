package com.speakup.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LessonResource {

    private String id;

    private String title;

    private ResourceType type; // pdf, video, exercise, reading, link

    private String url;

    private String description;

    private LocalDateTime uploadedDate;

    private String fileSize;

    private Integer order = 0; // for ordering resources

    public enum ResourceType {
        PDF("📄"),
        VIDEO("🎥"),
        EXERCISE("✏️"),
        READING("📖"),
        LINK("🔗");

        private final String icon;

        ResourceType(String icon) {
            this.icon = icon;
        }

        public String getIcon() {
            return icon;
        }
    }

    // Constructor
    public LessonResource(String title, ResourceType type, String url) {
        this.id = org.springframework.data.mongodb.core.ObjectIdUtils.toString(new org.bson.types.ObjectId());
        this.title = title;
        this.type = type;
        this.url = url;
        this.uploadedDate = LocalDateTime.now();
    }
}