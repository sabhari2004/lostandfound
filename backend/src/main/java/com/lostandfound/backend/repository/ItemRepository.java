package com.lostandfound.backend.repository;

import com.lostandfound.backend.model.Item;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemRepository extends MongoRepository<Item, String> {
    // This allows us to search items by their name easily if we need to later
}