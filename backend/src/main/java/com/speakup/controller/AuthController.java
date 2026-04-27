package com.speakup.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.speakup.model.User;
import com.speakup.repository.UserRepository;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")

public class AuthController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private MongoTemplate mongoTemplate;
    // Registration and Login endpoints
    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        return userRepository.save(user);
    }

  
@PostMapping("/login")
public ResponseEntity<?> loginUser(@RequestBody User user) {
    try {
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());

        if (existingUser.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("error", "User not found"));
        }

        User dbUser = existingUser.get();

        if (dbUser.getPassword().equals(user.getPassword())) {
            // Create a response map that includes the 'token' key
            Map<String, Object> response = new HashMap<>();
            response.put("token", dbUser.getId()); // Frontend is looking for this!
            response.put("username", dbUser.getUsername());
            response.put("email", dbUser.getEmail());
            
            return ResponseEntity.ok(response); 
        } else {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid password"));
        }
    } catch (Exception e) {
        e.printStackTrace(); 
        return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
    }
}

   

@GetMapping("/db")
public String getDbName() {
    return mongoTemplate.getDb().getName();
}
}