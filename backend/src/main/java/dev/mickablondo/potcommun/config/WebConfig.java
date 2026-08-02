package dev.mickablondo.potcommun.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuration pour gérer les paramètres CORS (Cross-Origin Resource Sharing) pour l'application.
 * Cette configuration permet de définir les origines autorisées, les méthodes HTTP autorisées et les
 * chemins d'API pour lesquels les requêtes CORS sont acceptées.
 *
 * @author micka blondo
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOriginPatterns("http://localhost:*", "http://127.0.0.1:*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                .allowedHeaders("*");
    }
}
