package com.speakup.dto;
import lombok.Data;


public class UpdateMeetingLinkRequest {

    private String meetingLink;

    public String getMeetingLink() {
        return meetingLink;
    }

    public void setMeetingLink(String meetingLink) {
        this.meetingLink = meetingLink;
    }
    
}
