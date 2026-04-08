package com.clubmanagement.backend.controller;

import com.clubmanagement.backend.model.Certificate;
import com.clubmanagement.backend.service.CertificateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/certificates")
public class CertificateController {

    @Autowired
    private CertificateService service;

    @GetMapping("/generate")
    public Certificate generateCertificate(@RequestParam int userId,
                                           @RequestParam int eventId) {
        return service.generateCertificate(userId, eventId);
    }

    @GetMapping("/verify/{certificateId}")
    public Certificate verifyCertificate(@PathVariable String certificateId) {
        return service.verifyCertificate(certificateId);
    }
}