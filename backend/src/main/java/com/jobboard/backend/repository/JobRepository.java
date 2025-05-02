package com.jobboard.backend.repository;

import com.jobboard.backend.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobRepository extends JpaRepository<Job, Long> {
}
