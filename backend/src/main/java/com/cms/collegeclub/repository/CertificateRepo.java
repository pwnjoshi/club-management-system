package com.cms.collegeclub.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cms.collegeclub.entity.Certificate;

public interface CertificateRepo extends JpaRepository<Certificate, Long> {
    Optional<Certificate> findByCertificateCode(String certificateCode);
    List<Certificate> findByEmail(String email);
    boolean existsByEventIdAndEmail(Long eventId, String email);
}
