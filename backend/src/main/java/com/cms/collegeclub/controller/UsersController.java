package com.cms.collegeclub.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;

import com.cms.collegeclub.entity.Users;
import com.cms.collegeclub.requests.LoginRequest;
import com.cms.collegeclub.requests.LoginResponse;
import com.cms.collegeclub.service.UserService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class UsersController {

    @Autowired
    UserService userService;

    @PostMapping("/register")
    public ResponseEntity<LoginResponse> addUser(@RequestBody Users user) {
        try {
            Users created = userService.addUser(user);
            return ResponseEntity.ok(new LoginResponse(true, "Registration successful", created.getName(), created.getEmail(), created.getRole()));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(new LoginResponse(false, ex.getMessage(), null, null, null));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> loginUser(@RequestBody LoginRequest loginRequest) {
        return userService.loginUser(loginRequest)
            .map(user -> ResponseEntity.ok(new LoginResponse(true, "Login successful", user.getName(), user.getEmail(), user.getRole())))
                .orElseGet(() -> ResponseEntity.status(401)
                .body(new LoginResponse(false, "Invalid email or password", null, null, null)));
    }

}
