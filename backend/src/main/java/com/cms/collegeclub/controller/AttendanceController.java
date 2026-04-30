package com.cms.collegeclub.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cms.collegeclub.entity.Attendance;
import com.cms.collegeclub.entity.Event;
import com.cms.collegeclub.entity.Users;
import com.cms.collegeclub.repository.AttendanceRepo;
import com.cms.collegeclub.repository.EventRegistrationRepo;
import com.cms.collegeclub.repository.EventRepo;
import com.cms.collegeclub.repository.UsersRepo;
import com.cms.collegeclub.requests.LoginResponse;
import com.cms.collegeclub.service.QRCodeService;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceRepo attendanceRepo;

    @Autowired
    private EventRepo eventRepo;

    @Autowired
    private EventRegistrationRepo eventRegistrationRepo;

    @Autowired
    private UsersRepo usersRepo;

    @Autowired
    private QRCodeService qrCodeService;

    @GetMapping("/{eventId}/qrcode")
    public ResponseEntity<?> generateQRCode(
            @PathVariable Long eventId,
            @RequestParam String requesterEmail) {

        Users requester = usersRepo.findById(requesterEmail).orElse(null);
        if (requester == null || !"ADMIN".equalsIgnoreCase(requester.getRole())) {
            return ResponseEntity.status(403)
                    .body(new LoginResponse(false, "Only admins can generate QR codes", null, requesterEmail, null));
        }

        Event event = eventRepo.findById(eventId).orElse(null);
        if (event == null) {
            return ResponseEntity.status(404)
                    .body(new LoginResponse(false, "Event not found", null, null, null));
        }

        String qrPayload = "CHECKIN:" + eventId;
        String base64Image = qrCodeService.generateQRCodeBase64(qrPayload, 300, 300);

        if (base64Image == null) {
            return ResponseEntity.status(500)
                    .body(new LoginResponse(false, "Failed to generate QR code", null, null, null));
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("eventId", eventId);
        response.put("eventTitle", event.getTitle());
        response.put("qrImage", "data:image/png;base64," + base64Image);
        response.put("payload", qrPayload);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/checkin")
    public ResponseEntity<LoginResponse> checkIn(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String payload = request.get("payload");

        if (email == null || email.isBlank() || payload == null || payload.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(new LoginResponse(false, "Email and QR payload are required", null, null, null));
        }

        if (!payload.startsWith("CHECKIN:")) {
            return ResponseEntity.badRequest()
                    .body(new LoginResponse(false, "Invalid QR code", null, email, null));
        }

        Long eventId;
        try {
            eventId = Long.parseLong(payload.substring("CHECKIN:".length()));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest()
                    .body(new LoginResponse(false, "Invalid QR code format", null, email, null));
        }

        Event event = eventRepo.findById(eventId).orElse(null);
        if (event == null) {
            return ResponseEntity.status(404)
                    .body(new LoginResponse(false, "Event not found", null, email, null));
        }

        if (!eventRegistrationRepo.existsByEventIdAndEmail(eventId, email)) {
            return ResponseEntity.badRequest()
                    .body(new LoginResponse(false, "You are not registered for this event. Please register first.", null, email, null));
        }

        if (attendanceRepo.existsByEventIdAndEmail(eventId, email)) {
            return ResponseEntity.badRequest()
                    .body(new LoginResponse(false, "Attendance already marked for this event", null, email, null));
        }

        Attendance attendance = new Attendance();
        attendance.setEventId(eventId);
        attendance.setEmail(email);
        attendance.setCheckedInAt(LocalDateTime.now());
        attendanceRepo.save(attendance);

        return ResponseEntity.ok(
                new LoginResponse(true, "Attendance marked successfully for " + event.getTitle(), null, email, null));
    }

    @GetMapping("/{eventId}")
    public ResponseEntity<?> getEventAttendance(
            @PathVariable Long eventId,
            @RequestParam String requesterEmail) {

        Users requester = usersRepo.findById(requesterEmail).orElse(null);
        if (requester == null || !"ADMIN".equalsIgnoreCase(requester.getRole())) {
            return ResponseEntity.status(403)
                    .body(new LoginResponse(false, "Only admins can view attendance records", null, requesterEmail, null));
        }

        List<Attendance> records = attendanceRepo.findByEventId(eventId);
        return ResponseEntity.ok(records);
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyAttendance(@RequestParam String email) {
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(new LoginResponse(false, "Email is required", null, null, null));
        }

        List<Attendance> records = attendanceRepo.findByEmail(email);

        List<Map<String, Object>> enriched = records.stream().map(record -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", record.getId());
            map.put("eventId", record.getEventId());
            map.put("email", record.getEmail());
            map.put("checkedInAt", record.getCheckedInAt());

            Event event = eventRepo.findById(record.getEventId()).orElse(null);
            map.put("eventTitle", event != null ? event.getTitle() : "Unknown Event");
            map.put("eventDate", event != null ? event.getEventDate() : "Unknown");
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(enriched);
    }
}
