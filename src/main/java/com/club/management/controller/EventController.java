package com.club.management.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;
import com.club.management.model.Event;
import com.club.management.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/events")
public class EventController {

    @Autowired
    private EventRepository eventRepository;

    @PostMapping
    public Event createEvent(@RequestBody Event event) {
        return eventRepository.save(event);
    }

    @GetMapping
    public List<Event> getEvents() {
        return eventRepository.findAll();
    }
}