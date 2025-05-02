package com.jobboard.backend.controller;

import com.jobboard.backend.model.Job;
import com.jobboard.backend.repository.JobRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "http://localhost:3000") // Allows frontend to talk to backend
public class JobController {

    private final JobRepository jobRepository;

    public JobController(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    @GetMapping
    public List<Job> getAllJobs() {
        return jobRepository.findAll(); // ✅ Load from PostgreSQL
    }

    @PostMapping
    public void createJob(@RequestBody Job job) {
        jobRepository.save(job); // ✅ Save to PostgreSQL
        System.out.println("Saved job: " + job.getTitle());
    }
}
