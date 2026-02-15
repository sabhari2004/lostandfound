package com.lostandfound.backend.controller;

import com.lostandfound.backend.model.User;
import com.lostandfound.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // 1. Register a new user (Manually add demo accounts)
    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        // Ensure role defaults to STUDENT if not provided
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("STUDENT");
        }
        return ResponseEntity.ok(userRepository.save(user));
    }

    // 2. Login a user (Database-driven)
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String password = loginData.get("password");

        // Find the user in MongoDB by email
        User foundUser = userRepository.findByEmail(email);

        // Check if user exists AND password matches
        if (foundUser != null && foundUser.getPassword().equals(password)) {
            // Return the full user object so the frontend knows the Name and Role
            return ResponseEntity.ok(foundUser);
        } else {
            // Return a clear error message for the showToast() function
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid KCT credentials");
        }
    }

    // 3. Get all users (Departmental Audit)
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}