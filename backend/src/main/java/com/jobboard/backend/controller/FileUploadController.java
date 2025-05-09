package com.jobboard.backend.controller;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "http://localhost:3000")
public class FileUploadController {

    // Use relative paths, not absolute
    private static final String UPLOAD_BASE_DIR = "uploads";  // Relative directory
    private static final String RESUME_DIR = UPLOAD_BASE_DIR + "/resumes/";
    private static final String COVER_LETTER_DIR = UPLOAD_BASE_DIR + "/coverletters/";

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadFiles(
            @RequestParam("resume") MultipartFile resume,
            @RequestParam(value = "coverLetter", required = false) MultipartFile coverLetter
    ) {
        Map<String, String> response = new HashMap<>();

        try {
            // Ensure the directories exist
            Files.createDirectories(Paths.get(RESUME_DIR));
            Files.createDirectories(Paths.get(COVER_LETTER_DIR));

            // Upload Resume
            String resumeName = System.currentTimeMillis() + "_" + resume.getOriginalFilename();
            Path resumePath = Paths.get(RESUME_DIR + resumeName);
            Files.copy(resume.getInputStream(), resumePath, StandardCopyOption.REPLACE_EXISTING);
            response.put("resumePath", resumeName); // Store only the filename

            // Upload Cover Letter (optional)
            if (coverLetter != null && !coverLetter.isEmpty()) {
                String clName = System.currentTimeMillis() + "_" + coverLetter.getOriginalFilename();
                Path clPath = Paths.get(COVER_LETTER_DIR + clName);
                Files.copy(coverLetter.getInputStream(), clPath, StandardCopyOption.REPLACE_EXISTING);
                response.put("coverLetterPath", clName); // Store only the filename
            } else {
                response.put("coverLetterPath", "Not provided");
            }

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            return ResponseEntity.status(500).body(Map.of("error", "Upload failed: " + e.getMessage()));
        }
    }

    @GetMapping("/download")
    public ResponseEntity<Resource> downloadFile(
            @RequestParam String filename,
            @RequestParam String type
    ) {
        // Build the path dynamically based on file type
        String baseDir = type.equalsIgnoreCase("resume") ? RESUME_DIR : COVER_LETTER_DIR;
        Path filePath = Paths.get(System.getProperty("user.dir"), baseDir, filename).normalize();

        try {
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                        .contentType(MediaType.APPLICATION_OCTET_STREAM)
                        .body(resource);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }
}
