package com.lostandfound.backend.repository;

import com.lostandfound.backend.model.Item;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ItemRepository extends MongoRepository<Item, String> {

    // 1. Find by Status (e.g., Show me only "LOST" items)
    List<Item> findByStatus(String status);

    // 2. Find by Location (e.g., Show me items in "Library")
    List<Item> findByLocation(String location);

    // 3. Smart Search (Finds text in Name, Location, or Description)
    // The "?0" means the first parameter you pass to the function
    @Query("{'$or': [ " +
            "{ 'name': { '$regex': ?0, '$options': 'i' } }, " +
            "{ 'location': { '$regex': ?0, '$options': 'i' } }, " +
            "{ 'description': { '$regex': ?0, '$options': 'i' } } " +
            "]}")
    List<Item> searchItems(String keyword);
}