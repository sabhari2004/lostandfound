package com.lostandfound.backend.controller;

import com.lostandfound.backend.model.Item;
import com.lostandfound.backend.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "*") // Allows Frontend to communicate with Backend
public class ItemController {

    @Autowired
    private ItemRepository itemRepository;

    // 1. GET ALL ITEMS (Sorted by Newest First)
    @GetMapping
    public List<Item> getAllItems() {
        // Sort.Direction.DESC means "Descending" (Newest ID at top)
        return itemRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
    }

    // 2. ADD NEW ITEM (With College Features)
    @PostMapping("/add")
    public Item addItem(@RequestBody Item item) {
        // You could add backend validation here if needed
        return itemRepository.save(item);
    }

    // 3. SEARCH ITEMS (For the Search Bar)
    @GetMapping("/search")
    public List<Item> search(@RequestParam String query) {
        return itemRepository.searchItems(query);
    }

    // 4. FILTER BY CATEGORY (For the "Chips" - Lost/Found/Location)
    @GetMapping("/filter")
    public List<Item> filter(@RequestParam(required = false) String status,
                             @RequestParam(required = false) String location) {
        if (status != null) {
            return itemRepository.findByStatus(status);
        } else if (location != null) {
            return itemRepository.findByLocation(location);
        }
        return getAllItems();
    }

    // 5. DELETE ITEM (For Admin)
    @DeleteMapping("/delete/{id}")
    public void deleteItem(@PathVariable String id) {
        itemRepository.deleteById(id);
    }

    // 6. DELETE ALL ITEMS (Admin only feature)
    @DeleteMapping("/delete-all")
    public void deleteAllItems() {
        itemRepository.deleteAll();
    }
}