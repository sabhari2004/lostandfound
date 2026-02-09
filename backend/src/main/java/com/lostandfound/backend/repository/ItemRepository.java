package com.lostandfound.backend.repository;

import com.lostandfound.backend.model.Item;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends MongoRepository<Item, String> {
    // This allows us to search items by their name easily if we need to later
    // Add this line inside the { }
    List<Item> findByNameContainingIgnoreCaseOrLocationContainingIgnoreCase(String name, String location);
}