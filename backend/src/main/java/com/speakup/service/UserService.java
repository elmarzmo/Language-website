package com.speakup.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.speakup.model.User;
import com.speakup.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;


    public UserService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    public List<User> getAllStudents(){

        return userRepository.findByRole(User.Role.STUDENT);
    }

    public List<User> searchUnassignedStudents(String query) {
        if (query == null || query.trim().isEmpty()) {
            return List.of(); // Return empty list if query is null or empty
        }
        return userRepository.findTop10ByRoleAndUsernameContainingIgnoreCase(User.Role.STUDENT, query);
    }
}
