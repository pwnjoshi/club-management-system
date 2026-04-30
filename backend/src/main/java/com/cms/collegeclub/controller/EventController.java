package com.cms.collegeclub.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cms.collegeclub.entity.Event;
import com.cms.collegeclub.entity.EventRegistration;
import com.cms.collegeclub.entity.Users;
import com.cms.collegeclub.repository.EventRegistrationRepo;
import com.cms.collegeclub.repository.EventRepo;
import com.cms.collegeclub.repository.UsersRepo;
import com.cms.collegeclub.requests.EventRegistrationRequest;
import com.cms.collegeclub.requests.LoginResponse;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:3000")
public class EventController {

    @Autowired
    private EventRepo eventRepo;

    @Autowired
    private EventRegistrationRepo eventRegistrationRepo;

    @Autowired
    private UsersRepo usersRepo;

    @GetMapping
    public List<Event> getEvents() {
        return eventRepo.findAll();
    }

    @PostMapping
    public Event createEvent(@RequestBody Event event) {
        if (event.getSeatsAvailable() == null || event.getSeatsAvailable() < 1) {
            event.setSeatsAvailable(1);
        }
        return eventRepo.save(event);
    }

    @PostMapping("/{eventId}/register")
    public ResponseEntity<LoginResponse> registerForEvent(
            @PathVariable Long eventId,
            @RequestBody EventRegistrationRequest request) {

        if (request.getEmail() == null || request.getEmail().isBlank()) {
            return ResponseEntity.badRequest().body(new LoginResponse(false, "Email is required", null, null, null));
        }

        Event event = eventRepo.findById(eventId).orElse(null);
        if (event == null) {
            return ResponseEntity.status(404).body(new LoginResponse(false, "Event not found", null, null, null));
        }

        if (eventRegistrationRepo.existsByEventIdAndEmail(eventId, request.getEmail())) {
            return ResponseEntity.badRequest().body(new LoginResponse(false, "You are already registered for this event", null, request.getEmail(), null));
        }

        if (event.getSeatsAvailable() < 1) {
            return ResponseEntity.badRequest().body(new LoginResponse(false, "No seats left for this event", null, request.getEmail(), null));
        }

        EventRegistration registration = new EventRegistration();
        registration.setEmail(request.getEmail());
        registration.setEventId(eventId);
        registration.setRegisteredAt(LocalDateTime.now());
        eventRegistrationRepo.save(registration);

        event.setSeatsAvailable(event.getSeatsAvailable() - 1);
        eventRepo.save(event);

        return ResponseEntity.ok(new LoginResponse(true, "Event registration successful", null, request.getEmail(), null));
    }

    @GetMapping("/registrations")
    public ResponseEntity<?> getRegistrations(
            @RequestParam(required = false) String requesterEmail,
            @RequestParam(required = false) String email) {
        if (requesterEmail == null || requesterEmail.isBlank()) {
            if (email == null || email.isBlank()) {
                return ResponseEntity.badRequest().body(new LoginResponse(false, "Email is required", null, null, null));
            }
            return ResponseEntity.ok(eventRegistrationRepo.findByEmail(email));
        }

        Users requester = usersRepo.findById(requesterEmail).orElse(null);
        if (requester == null) {
            return ResponseEntity.status(403).body(new LoginResponse(false, "Invalid requester", null, requesterEmail, null));
        }

        boolean isAdmin = requester.getRole() != null && "ADMIN".equalsIgnoreCase(requester.getRole());
        if (isAdmin && (email == null || email.isBlank())) {
            return ResponseEntity.ok(eventRegistrationRepo.findAll());
        }

        if (isAdmin) {
            return ResponseEntity.ok(eventRegistrationRepo.findByEmail(email));
        }

        if (email != null && !email.isBlank() && !requesterEmail.equalsIgnoreCase(email)) {
            return ResponseEntity.status(403)
                    .body(new LoginResponse(false, "You can view only your own registrations", null, requesterEmail, null));
        }

        return ResponseEntity.ok(eventRegistrationRepo.findByEmail(requesterEmail));
    }
}
