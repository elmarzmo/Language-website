package com.speakup.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.speakup.model.User;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
}