package dev.mickablondo.potcommun;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@SpringBootApplication
public class PotCommunApplication {
    public static void main(String[] args) {
        Path envPath = Paths.get(".env");
        if (Files.exists(envPath)) {
            try {
                Files.lines(envPath)
                        .map(String::trim)
                        .filter(line -> !line.isEmpty() && !line.startsWith("#"))
                        .forEach(line -> {
                            int idx = line.indexOf('=');
                            if (idx > 0) {
                                String key = line.substring(0, idx).trim();
                                String val = line.substring(idx + 1).trim();
                                if ((val.startsWith("\"") && val.endsWith("\"")) || (val.startsWith("'") && val.endsWith("'"))) {
                                    val = val.substring(1, val.length() - 1);
                                }
                                System.setProperty(key, val);
                            }
                        });
            } catch (IOException e) {
                // je ne fais rien
            }
        }

        SpringApplication.run(PotCommunApplication.class, args);
    }
}
