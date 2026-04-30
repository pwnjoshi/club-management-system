package com.cms.collegeclub.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cms.collegeclub.entity.EventRegistration;

public interface EventRegistrationRepo extends JpaRepository<EventRegistration, Long> {
    boolean existsByEventIdAndEmail(Long eventId, String email);
    List<EventRegistration> findByEmail(String email);
}
