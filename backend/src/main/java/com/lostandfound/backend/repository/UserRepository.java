package com.lostandfound.backend.repository;

import com.lostandfound.backend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    // This allows us to find a user by their email (useful for Login!)
    User findByEmail(String email);
}