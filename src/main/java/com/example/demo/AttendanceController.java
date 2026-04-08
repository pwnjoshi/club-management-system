package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/attendance")
@CrossOrigin(origins = "*") // allows React frontend to connect
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    // POST /attendance/mark
    // Body: { "userId": 1, "eventId": 2, "status": "present" }
    @PostMapping("/mark")
    public ResponseEntity<?> markAttendance(@RequestBody Map<String, Object> body) {
        try {
            Long userId = Long.valueOf(body.get("userId").toString());
            Long eventId = Long.valueOf(body.get("eventId").toString());
            String status = body.get("status").toString();

            Attendance saved = attendanceService.markAttendance(userId, eventId, status);
            return ResponseEntity.ok(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // GET /attendance/user/{userId}  — used for dashboard
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Attendance>> getUserAttendance(@PathVariable Long userId) {
        List<Attendance> records = attendanceService.getAttendanceByUser(userId);
        return ResponseEntity.ok(records);
    }

    // GET /attendance/event/{eventId}
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<Attendance>> getEventAttendance(@PathVariable Long eventId) {
        List<Attendance> records = attendanceService.getAttendanceByEvent(eventId);
        return ResponseEntity.ok(records);
    }
}
