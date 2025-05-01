package com.jobboard.backend.model;

public class Job {
    private String title;
    private String location;
    private int salary;

    public Job(String title, String location, int salary) {
        this.title = title;
        this.location = location;
        this.salary = salary;
    }

    // Getters required for JSON serialization
    public String getTitle() {
        return title;
    }

    public String getLocation() {
        return location;
    }

    public int getSalary() {
        return salary;
    }
}
