package com.speakup.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {

    private final Path uploadLocation = Paths.get("uploads/audio");

    public FileStorageService() {
        try {
            Files.createDirectories(uploadLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not create audio upload folder", e);
        }
    }


    public String save(MultipartFile file) {

        try {

            // Get original filename
            String originalFilename = file.getOriginalFilename();

            if (originalFilename == null) {
                throw new RuntimeException("Invalid file name");
            }


            // Create unique filename to avoid conflicts
            String filename =
                    UUID.randomUUID()
                    + "_"
                    + originalFilename;


            Path destination =
                    uploadLocation.resolve(filename);


            // Copy file to uploads/audio
            System.out.println("Saving file to: " + destination.toAbsolutePath());

            Files.copy(
                    file.getInputStream(),
                    destination,
                    StandardCopyOption.REPLACE_EXISTING
            );


            // URL stored in database
            return "/audio/" + filename;


        } catch (IOException e) {

            throw new RuntimeException(
                "Failed to store audio file",
                e
            );
        }
    }
}