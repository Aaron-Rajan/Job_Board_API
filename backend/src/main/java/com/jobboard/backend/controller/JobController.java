package com.jobboard.backend.controller;

import com.jobboard.backend.model.Application;
import com.jobboard.backend.model.Job;
import com.jobboard.backend.repository.ApplicationRepository;
import com.jobboard.backend.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "http://localhost:3000") // Allows frontend to talk to backend
public class JobController {

    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;

    @Autowired
    public JobController(JobRepository jobRepository, ApplicationRepository applicationRepository) {
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
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

    @PostMapping("/{jobId}/apply")
    public ResponseEntity<String> applyToJob(@PathVariable Long jobId, @RequestBody Application application) {
        Optional<Job> job = jobRepository.findById(jobId);
        if (job.isPresent()) {
            application.setJob(job.get());
            applicationRepository.save(application);
            return ResponseEntity.ok("Application submitted successfully!");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
