package com.jobboard.backend.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String location;
    private int salary;

    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL)
    private List<Application> applications;

    // Required by JPA
    public Job() {}

    public Job(String title, String location, int salary) {
        this.title = title;
        this.location = location;
        this.salary = salary;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getLocation() {
        return location;
    }

    public int getSalary() {
        return salary;
    }

    public List<Application> getApplications() {
        return applications;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public void setSalary(int salary) {
        this.salary = salary;
    }

    public void setApplications(List<Application> applications) {
        this.applications = applications;
    }
}
