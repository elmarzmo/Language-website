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
}
