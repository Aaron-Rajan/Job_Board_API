package com.jobboard.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String applicantName;
    private String applicantEmail;

    @Column
    private String resumePath;

    @Column
    private String coverLetterPath;

    @ManyToOne
    @JoinColumn(name = "job_id")
    @JsonIgnoreProperties("applications") // ✅ Avoid recursion
    private Job job;
}
