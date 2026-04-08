package com.club.management.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.club.management.model.Registration;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {
}