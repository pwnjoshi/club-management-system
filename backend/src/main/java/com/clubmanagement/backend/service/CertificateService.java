package com.clubmanagement.backend.service;

import com.clubmanagement.backend.model.Certificate;
import com.clubmanagement.backend.repository.CertificateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.UUID;

@Service
public class CertificateService {

    @Autowired
    private CertificateRepository repository;

    public Certificate generateCertificate(int userId, int eventId) {

        Certificate certificate = new Certificate();

        certificate.setUserId(userId);
        certificate.setEventId(eventId);
        certificate.setCertificateId(UUID.randomUUID().toString());
        certificate.setIssueDate(LocalDate.now());

        return repository.save(certificate);
    }

    public Certificate verifyCertificate(String certificateId) {
        return repository.findByCertificateId(certificateId)
                .orElse(null);
    }
}