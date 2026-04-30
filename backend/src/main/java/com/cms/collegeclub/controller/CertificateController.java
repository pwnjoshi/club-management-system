package com.cms.collegeclub.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cms.collegeclub.entity.Attendance;
import com.cms.collegeclub.entity.Certificate;
import com.cms.collegeclub.entity.Event;
import com.cms.collegeclub.entity.Users;
import com.cms.collegeclub.repository.AttendanceRepo;
import com.cms.collegeclub.repository.CertificateRepo;
import com.cms.collegeclub.repository.EventRepo;
import com.cms.collegeclub.repository.UsersRepo;
import com.cms.collegeclub.requests.LoginResponse;

@RestController
@RequestMapping("/api/certificates")
@CrossOrigin(origins = "http://localhost:3000")
public class CertificateController {

    @Autowired
    private CertificateRepo certificateRepo;

    @Autowired
    private AttendanceRepo attendanceRepo;

    @Autowired
    private EventRepo eventRepo;

    @Autowired
    private UsersRepo usersRepo;

    @PostMapping("/issue")
    public ResponseEntity<?> issueCertificate(@RequestBody Map<String, String> request) {
        String adminEmail = request.get("adminEmail");
        String userEmail = request.get("userEmail");
        String eventIdStr = request.get("eventId");

        if (adminEmail == null || userEmail == null || eventIdStr == null) {
            return ResponseEntity.badRequest()
                    .body(new LoginResponse(false, "adminEmail, userEmail, and eventId are required", null, null, null));
        }

        Users admin = usersRepo.findById(adminEmail).orElse(null);
        if (admin == null || !"ADMIN".equalsIgnoreCase(admin.getRole())) {
            return ResponseEntity.status(403)
                    .body(new LoginResponse(false, "Only admins can issue certificates", null, adminEmail, null));
        }

        Long eventId;
        try {
            eventId = Long.parseLong(eventIdStr);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest()
                    .body(new LoginResponse(false, "Invalid event ID", null, null, null));
        }

        Event event = eventRepo.findById(eventId).orElse(null);
        if (event == null) {
            return ResponseEntity.status(404)
                    .body(new LoginResponse(false, "Event not found", null, null, null));
        }

        if (!attendanceRepo.existsByEventIdAndEmail(eventId, userEmail)) {
            return ResponseEntity.badRequest()
                    .body(new LoginResponse(false, "User has no attendance record for this event", null, userEmail, null));
        }

        if (certificateRepo.existsByEventIdAndEmail(eventId, userEmail)) {
            return ResponseEntity.badRequest()
                    .body(new LoginResponse(false, "Certificate already issued for this user and event", null, userEmail, null));
        }

        Users user = usersRepo.findById(userEmail).orElse(null);
        String recipientName = (user != null && user.getName() != null) ? user.getName() : userEmail;

        Certificate certificate = new Certificate();
        certificate.setEmail(userEmail);
        certificate.setEventId(eventId);
        certificate.setCertificateCode("CERT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        certificate.setRecipientName(recipientName);
        certificate.setEventTitle(event.getTitle());
        certificate.setIssuedAt(LocalDateTime.now());
        certificateRepo.save(certificate);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Certificate issued successfully");
        response.put("certificate", certificate);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/issue-bulk")
    public ResponseEntity<?> issueBulkCertificates(@RequestBody Map<String, String> request) {
        String adminEmail = request.get("adminEmail");
        String eventIdStr = request.get("eventId");

        if (adminEmail == null || eventIdStr == null) {
            return ResponseEntity.badRequest()
                    .body(new LoginResponse(false, "adminEmail and eventId are required", null, null, null));
        }

        Users admin = usersRepo.findById(adminEmail).orElse(null);
        if (admin == null || !"ADMIN".equalsIgnoreCase(admin.getRole())) {
            return ResponseEntity.status(403)
                    .body(new LoginResponse(false, "Only admins can issue certificates", null, adminEmail, null));
        }

        Long eventId;
        try {
            eventId = Long.parseLong(eventIdStr);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest()
                    .body(new LoginResponse(false, "Invalid event ID", null, null, null));
        }

        Event event = eventRepo.findById(eventId).orElse(null);
        if (event == null) {
            return ResponseEntity.status(404)
                    .body(new LoginResponse(false, "Event not found", null, null, null));
        }

        List<Attendance> attendees = attendanceRepo.findByEventId(eventId);
        int issued = 0;
        int skipped = 0;

        for (Attendance att : attendees) {
            if (certificateRepo.existsByEventIdAndEmail(eventId, att.getEmail())) {
                skipped++;
                continue;
            }

            Users user = usersRepo.findById(att.getEmail()).orElse(null);
            String recipientName = (user != null && user.getName() != null) ? user.getName() : att.getEmail();

            Certificate certificate = new Certificate();
            certificate.setEmail(att.getEmail());
            certificate.setEventId(eventId);
            certificate.setCertificateCode("CERT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            certificate.setRecipientName(recipientName);
            certificate.setEventTitle(event.getTitle());
            certificate.setIssuedAt(LocalDateTime.now());
            certificateRepo.save(certificate);
            issued++;
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Certificates issued: " + issued + ", already existed: " + skipped);
        response.put("issued", issued);
        response.put("skipped", skipped);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyCertificate(@RequestParam String code) {
        if (code == null || code.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(new LoginResponse(false, "Certificate code is required", null, null, null));
        }

        Certificate certificate = certificateRepo.findByCertificateCode(code).orElse(null);
        if (certificate == null) {
            Map<String, Object> response = new HashMap<>();
            response.put("valid", false);
            response.put("message", "No certificate found with this code. It may be invalid or fake.");
            return ResponseEntity.ok(response);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("valid", true);
        response.put("message", "Certificate is valid and verified");
        response.put("certificate", certificate);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyCertificates(@RequestParam String email) {
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(new LoginResponse(false, "Email is required", null, null, null));
        }

        List<Certificate> certificates = certificateRepo.findByEmail(email);
        return ResponseEntity.ok(certificates);
    }
}
