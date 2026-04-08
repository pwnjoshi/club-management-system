package com.club.management.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.club.management.repository.RegistrationRepository;
import com.club.management.model.Registration;
import java.util.*;

@RestController
@RequestMapping("/register-event")
public class RegistrationController {

    @Autowired
    private RegistrationRepository repo;

    // POST (register)
    @PostMapping
    public Registration register(@RequestBody Registration reg) {
        return repo.save(reg);
    }

    // GET (optional)
    @GetMapping
    public List<Registration> getAll() {
        return repo.findAll();
    }
}
