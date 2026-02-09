package com.lostandfound.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "items")
public class Item {

    @Id
    private String id;
    private String name;           // e.g., "Black Wallet"
    private String location;       // e.g., "Library"
    private String description;
    private String uploaderEmail;  // To know who found it
    private String date;
    private String image;          // We will store the image as a long text string (Base64)

    // Constructors
    public Item() {}

    public Item(String name, String location, String description, String uploaderEmail, String date, String image) {
        this.name = name;
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