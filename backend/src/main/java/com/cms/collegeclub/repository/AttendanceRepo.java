package com.cms.collegeclub.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cms.collegeclub.entity.Attendance;

public interface AttendanceRepo extends JpaRepository<Attendance, Long> {
    boolean existsByEventIdAndEmail(Long eventId, String email);
    List<Attendance> findByEventId(Long eventId);
    List<Attendance> findByEmail(String email);
}
