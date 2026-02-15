package com.lostandfound.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "items")
public class Item {

    @Id
    private String id;

    private String name;

    //  NEW: Stores "LOST" or "FOUND"
    private String status;

    private String location;       // e.g., "KCT Library"
    private String description;
    private String uploaderEmail;
    private String date;
    private String image;          // Base64 string

    // Constructors
    public Item() {}

    // Updated Constructor to include 'status'
    public Item(String name, String status, String location, String description, String uploaderEmail, String date, String image) {
        this.name = name;
        this.status = status;
        this.location = location;
        this.description = description;
        this.uploaderEmail = uploaderEmail;
        this.date = date;
        this.image = image;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    //  New Getter & Setter for Status
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getUploaderEmail() { return uploaderEmail; }
    public void setUploaderEmail(String uploaderEmail) { this.uploaderEmail = uploaderEmail; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
}