package com.speakup.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.speakup.model.User;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    
    List<User> findByRole(User.Role role);

    Optional<User> findByResetToken(String resetToken);

    List<User> findTop10ByRoleAndUsernameContainingIgnoreCase(User.Role role, String username);
}

