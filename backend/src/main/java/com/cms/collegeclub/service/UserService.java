package com.cms.collegeclub.service;

import java.util.Optional;

import com.cms.collegeclub.entity.Users;
import com.cms.collegeclub.repository.UsersRepo;
import com.cms.collegeclub.requests.LoginRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    UsersRepo usersRepo;

    public Users addUser(Users user){
        if (user.getEmail() == null || user.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (user.getPassword() == null || user.getPassword().length() < 5) {
            throw new IllegalArgumentException("Password must be at least 5 characters");
        }
        if (usersRepo.existsById(user.getEmail())) {
            throw new IllegalArgumentException("User with this email already exists");
        }

        if (user.getRole() == null || user.getRole().isBlank()) {
            user.setRole("STUDENT");
        }

        return usersRepo.save(user);
    }

    public Optional<Users> loginUser(LoginRequest loginRequest) {
        String email = loginRequest.getEmail();
        if (email == null || email.isBlank()) {
            email = loginRequest.getUserId();
        }

        if (email == null || email.isBlank() || loginRequest.getPassword() == null) {
            return Optional.empty();
        }

        Optional<Users> user = usersRepo.findById(email);
        if (user.isEmpty()) {
            return Optional.empty();
        }

        Users existingUser = user.get();
        if (!existingUser.getPassword().equals(loginRequest.getPassword())) {
            return Optional.empty();
        }

        return Optional.of(existingUser);
    }
}
