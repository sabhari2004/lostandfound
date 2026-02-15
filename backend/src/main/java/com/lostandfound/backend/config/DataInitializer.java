package com.lostandfound.backend.config;

import com.lostandfound.backend.model.User;
import com.lostandfound.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository) {
        return args -> {
            // Check if the Department Admin already exists to prevent duplicates
            if (userRepository.findByEmail("admin@kct.ac.in") == null) {

                System.out.println("--- Initializing Departmental Demo Accounts ---");

                // 1. Define your Department Admin
                User admin = new User("Department Admin", "admin@kct.ac.in", "admin123", "ADMIN");

                // 2. Define your Student Dataset
                // You can add your actual student names and roll numbers here
                List<User> demoStudents = Arrays.asList(
                        new User("Shree Sabhari", "shreesabhari.25mca@kct.ac.in", "KCT@25", "STUDENT"),
                        new User("Nivetha",   "nivetha.25mca@kct.ac.in", "KCT@25", "STUDENT"),
                        new User("Nithya shree", "nithyashree.25mca@kct.ac.in", "KCT@25", "STUDENT")
                );

                // 3. Save to MongoDB
                userRepository.save(admin);
                userRepository.saveAll(demoStudents);

                System.out.println("✅ Demo accounts successfully loaded into MongoDB.");
            } else {
                System.out.println("ℹ️ Demo accounts already exist in MongoDB. Skipping initialization.");
            }
        };
    }
}