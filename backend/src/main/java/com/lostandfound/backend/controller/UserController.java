package com.lostandfound.backend.controller;

import com.lostandfound.backend.model.User;
import com.lostandfound.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*") // Allows the frontend to talk to this backend
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // 1. Register a new user
    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    // 2. Login a user (NEW!)
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginData) {
        // Find the user in the database by email
        User foundUser = userRepository.findByEmail(loginData.getEmail());

        // Check if user exists AND password matches
        if (foundUser != null && foundUser.getPassword().equals(loginData.getPassword())) {
            return ResponseEntity.ok(foundUser); // Return success (200 OK)
        } else {
            return ResponseEntity.status(401).body("Invalid email or password"); // Return error (401 Unauthorized)
        }
    }

    // 3. Get all users (For testing)
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}