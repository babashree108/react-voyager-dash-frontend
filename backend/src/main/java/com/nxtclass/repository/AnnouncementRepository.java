package com.nxtclass.repository;

import com.nxtclass.entity.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {

    List<Announcement> findByAuthor(String author);
    
    List<Announcement> findByDate(LocalDate date);
    
    @Query("SELECT a FROM Announcement a WHERE a.date >= :startDate ORDER BY a.date DESC")
    List<Announcement> findRecentAnnouncements(@Param("startDate") LocalDate startDate);
}