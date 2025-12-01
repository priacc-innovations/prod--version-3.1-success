package com.example.employee_service_mama.service;

import com.example.employee_service_mama.model.Announcement;
import com.example.employee_service_mama.model.Users;
import com.example.employee_service_mama.repository.AnnouncementRepository;
import com.example.employee_service_mama.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final UserRepository usersRepository;

        public Announcement saveAnnouncement(Announcement announcement,Integer userId) {


           // Integer userId = announcement.getCreatedBy().getId();

            Users user = usersRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found!"));

            announcement.setCreatedBy(user); // Replace lazy object with fetched entity

            return announcementRepository.save(announcement);
        }

    public List<Announcement> getRecentAnnouncements() {
        return announcementRepository.findAllOrderByCreatedAtDesc();
    }
    }

