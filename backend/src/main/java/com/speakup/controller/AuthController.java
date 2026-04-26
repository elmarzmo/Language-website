package com.speakup.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
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
@CrossOrigin(origins = "http://localhost:3000")

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
public Object loginUser(@RequestBody User user) {

    Optional<User> existingUser = userRepository.findByEmail(user.getEmail());

    if (existingUser.isEmpty()) {
        return "User not found";
    }

    User dbUser = existingUser.get();

    if (dbUser.getPassword() == null || user.getPassword() == null) {
        return "Password is missing";
    }

    if (dbUser.getPassword().equals(user.getPassword())) {
        return dbUser;
    } else {
        return "Invalid password";
    }
    }


   

@GetMapping("/db")
public String getDbName() {
    return mongoTemplate.getDb().getName();
}
}