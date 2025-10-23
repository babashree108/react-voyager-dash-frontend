package com.nxtclass.controller;

import com.nxtclass.entity.Announcement;
import com.nxtclass.repository.AnnouncementRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/announcements")
public class AnnouncementController {
    
    @Autowired
    private AnnouncementRepository announcementRepository;

    @GetMapping
    public ResponseEntity<List<Announcement>> getAllAnnouncements() {
        List<Announcement> announcements = announcementRepository.findAll();
        return ResponseEntity.ok(announcements);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Announcement> getAnnouncementById(@PathVariable Long id) {
        Optional<Announcement> announcement = announcementRepository.findById(id);
        return announcement.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @GetMapping("/author/{author}")
    public ResponseEntity<List<Announcement>> getAnnouncementsByAuthor(@PathVariable String author) {
        List<Announcement> announcements = announcementRepository.findByAuthor(author);
        return ResponseEntity.ok(announcements);
    }

    @GetMapping("/recent")
    public ResponseEntity<List<Announcement>> getRecentAnnouncements() {
        List<Announcement> announcements = announcementRepository.findRecentAnnouncements(LocalDate.now().minusDays(30));
        return ResponseEntity.ok(announcements);
    }

    @PostMapping
    public ResponseEntity<Announcement> createAnnouncement(@Valid @RequestBody Announcement announcement) {
        Announcement savedAnnouncement = announcementRepository.save(announcement);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedAnnouncement);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Announcement> updateAnnouncement(@PathVariable Long id, @Valid @RequestBody Announcement announcement) {
        if (announcementRepository.existsById(id)) {
            announcement.setId(id);
            Announcement updatedAnnouncement = announcementRepository.save(announcement);
            return ResponseEntity.ok(updatedAnnouncement);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAnnouncement(@PathVariable Long id) {
        if (announcementRepository.existsById(id)) {
            announcementRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}