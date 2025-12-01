package com.example.employee_service_mama.controller;

import com.example.employee_service_mama.model.Users;
import com.example.employee_service_mama.service.UserService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@CrossOrigin(
        origins = {
                "https://teamhub.in",
                "http://teamhub.in",
                "http://52.202.113.154:80",
                "http://127.0.0.1:5173"
        },
        allowCredentials = "true"
)
public class UserController {

    private final UserService userService;

    @PostMapping("/signin")
    public Users signin(@RequestBody Map<String, String> map) {
        return userService.signin(map.get("email"), map.get("password"));
    }

    @GetMapping("/{id}")
    public Users getUser(@PathVariable Integer id) {
        return userService.getUserById(id);
    }

    @PutMapping("/update-profile/{id}")
    public Users updateProfile(@PathVariable Integer id, @RequestBody Users data) {
        return userService.updateProfile(id, data);
    }

    @PostMapping("/upload-photo/{id}")
    public Map<String, String> uploadPhoto(
            @PathVariable Integer id,
            @RequestParam("photo") MultipartFile file
    ) {
        String url = userService.uploadPhoto(id, file);
        return Map.of("url", url);
    }

    @PostMapping("/add")
    public Users addEmployee(@RequestBody Users user) {
        return userService.addEmployee(user);
    }

    @GetMapping("/all")
    public List<Users> getAllUsers() {
        return userService.getAllUsers();
    }

    @PutMapping("/hr/update/{id}")
    public Users updateEmployeeJob(@PathVariable Integer id, @RequestBody Users data) {
        return userService.updateEmployeeJobDetails(id, data);
    }

    @PostMapping("/add-bulk")
    public List<Users> addBulk(@RequestBody List<Users> users) {
        return userService.addBulkEmployees(users);
    }

    @GetMapping("/count")
    public Map<String, Long> getUserCount() {
        long count = userService.getTotalUserCount();
        return Map.of("count", count);
    }

    @GetMapping("/present-today")
    public Map<String, Long> getPresentToday() {
        long count = userService.getPresentTodayCount();
        return Map.of("count", count);
    }

    @GetMapping("/on-leave-today")
    public Map<String, Long> getOnLeaveToday() {
        long count = userService.getOnLeaveTodayCount();
        return Map.of("count", count);
    }
}

