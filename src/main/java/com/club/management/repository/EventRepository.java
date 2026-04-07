package com.club.management.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.club.management.model.Event;

public interface EventRepository extends JpaRepository<Event, Long> {
}