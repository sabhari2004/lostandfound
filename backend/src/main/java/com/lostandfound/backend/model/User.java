package com.lostandfound.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String name;

    // Email will act as the unique identifier for KCT students
    private String email;
    private String password;

    /** * ROLE Logic:
     * Use "ADMIN" for faculty/department heads
     * Use "STUDENT" for MCA students
     */
    private String role;

    // Default Constructor for MongoDB
    public User() {}

    // Full Constructor for creating demo accounts manually in your code
    public User(String name, String email, String password, String role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = (role == null) ? "STUDENT" : role.toUpperCase();
    }

    // Getters & Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) {
        this.role = (role != null) ? role.toUpperCase() : "STUDENT";
    }
}