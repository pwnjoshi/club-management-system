package com.cms.collegeclub.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cms.collegeclub.entity.Event;

public interface EventRepo extends JpaRepository<Event, Long> {
}
