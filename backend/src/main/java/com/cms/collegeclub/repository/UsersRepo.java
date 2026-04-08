package com.cms.collegeclub.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cms.collegeclub.entity.Users;

@Repository
public interface UsersRepo extends JpaRepository<Users, String> {
}