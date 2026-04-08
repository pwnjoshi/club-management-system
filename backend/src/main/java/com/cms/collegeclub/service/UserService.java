package com.cms.collegeclub.service;

import java.util.Optional;

import com.cms.collegeclub.entity.Users;
import com.cms.collegeclub.repository.UsersRepo;
import com.cms.collegeclub.requests.LoginRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    UsersRepo usersRepo;

    public Users addUser(Users user){

        return usersRepo.save(user);
    }

    public Boolean loginUser(LoginRequest loginRequest) {
        Optional<Users> user = usersRepo.findById(loginRequest.getUserId());
        if (user.isEmpty()) {
            return false;
        }

        Users existingUser = user.get();
        return existingUser.getPassword().equals(loginRequest.getPassword());
    }
}
