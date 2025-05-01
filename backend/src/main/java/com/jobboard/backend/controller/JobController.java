package com.jobboard.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import com.jobboard.backend.model.Job;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @GetMapping
    public List<Job> getAllJobs() {
        return List.of(new Job("Software Engineer", "Remote", 100000));
    }
}
