package com.jobboard.backend.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/upload")
public class FileUploadController {

    private static final String UPLOAD_BASE_DIR = System.getProperty("user.dir") + "/uploads/";
    private static final String RESUME_DIR = UPLOAD_BASE_DIR + "resumes/";
    private static final String COVER_LETTER_DIR = UPLOAD_BASE_DIR + "coverletters/";

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadFiles(
            @RequestParam("resume") MultipartFile resume,
            @RequestParam(value = "coverLetter", required = false) MultipartFile coverLetter
    ) {
        Map<String, String> response = new HashMap<>();

        try {
            // Create directories if they don't exist
            Files.createDirectories(Paths.get(RESUME_DIR));
            Files.createDirectories(Paths.get(COVER_LETTER_DIR));

            // Save resume
            String resumeName = System.currentTimeMillis() + "_resume_" + resume.getOriginalFilename();
            Path resumePath = Paths.get(RESUME_DIR + resumeName);
            Files.copy(resume.getInputStream(), resumePath, StandardCopyOption.REPLACE_EXISTING);
            response.put("resumePath", resumePath.toString());

            // Save cover letter if present
            if (coverLetter != null && !coverLetter.isEmpty()) {
                String clName = System.currentTimeMillis() + "_coverletter_" + coverLetter.getOriginalFilename();
                Path clPath = Paths.get(COVER_LETTER_DIR + clName);
                Files.copy(coverLetter.getInputStream(), clPath, StandardCopyOption.REPLACE_EXISTING);
                response.put("coverLetterPath", clPath.toString());
            } else {
                response.put("coverLetterPath", "Not provided");
            }

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            return ResponseEntity.status(500).body(Map.of("error", "Upload failed: " + e.getMessage()));
        }
    }
}
