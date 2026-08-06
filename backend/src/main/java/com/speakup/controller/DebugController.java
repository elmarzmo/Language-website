package com.speakup.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;


@RestController
public class DebugController {

    @GetMapping("/api/debug")
    public Map<String, String> debug(HttpServletRequest request) {
        Map<String, String> map = new HashMap<>();

        map.put("scheme", request.getScheme());
        map.put("serverName", request.getServerName());
        map.put("host", request.getHeader("Host"));
        map.put("x-forwarded-proto", request.getHeader("X-Forwarded-Proto"));
        map.put("x-forwarded-host", request.getHeader("X-Forwarded-Host"));
        map.put("forwarded", request.getHeader("Forwarded"));

        return map;
    }
}