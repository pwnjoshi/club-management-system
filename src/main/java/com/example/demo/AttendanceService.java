package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    // Mark attendance for a user at an event
    public Attendance markAttendance(Long userId, Long eventId, String status) {
        if (attendanceRepository.existsByUserIdAndEventId(userId, eventId)) {
            throw new RuntimeException("Attendance already marked for this user and event.");
        }
        Attendance attendance = new Attendance(userId, eventId, status);
        return attendanceRepository.save(attendance);
    }

    // Fetch all attendance records for a user (used for dashboard)
    public List<Attendance> getAttendanceByUser(Long userId) {
        return attendanceRepository.findByUserId(userId);
    }

    // Fetch all attendance records for an event
    public List<Attendance> getAttendanceByEvent(Long eventId) {
        return attendanceRepository.findByEventId(eventId);
    }
}
