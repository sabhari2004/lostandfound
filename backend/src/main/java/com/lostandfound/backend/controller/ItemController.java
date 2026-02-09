package com.lostandfound.backend.controller;

import com.lostandfound.backend.model.Item;
import com.lostandfound.backend.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "*") // Allow frontend to connect
public class ItemController {

    @Autowired
    private ItemRepository itemRepository;

    // 1. Save a new item (with image)
    @PostMapping("/add")
    public Item addItem(@RequestBody Item item) {
        return itemRepository.save(item);
    }

    // 2. Get all items (for the View page)
    @GetMapping
    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }
}