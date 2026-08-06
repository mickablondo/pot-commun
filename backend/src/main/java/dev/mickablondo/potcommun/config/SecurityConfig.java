package dev.mickablondo.potcommun.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Classe de configuration pour la sécurité de l'application.
 * Configure les règles de sécurité, y compris la désactivation de CSRF pour la console H2 et la configuration des en-têtes HTTP.
 *
 * @author micka blondo
 */
@Configuration
public class SecurityConfig {

    private final dev.mickablondo.potcommun.service.CustomUserDetailsService customUserDetailsService;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public SecurityConfig(dev.mickablondo.potcommun.service.CustomUserDetailsService customUserDetailsService, org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        this.customUserDetailsService = customUserDetailsService;
        this.passwordEncoder = passwordEncoder;
    }

    @Bean
    public org.springframework.security.authentication.AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder auth = http.getSharedObject(org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder.class);
        auth.userDetailsService(customUserDetailsService).passwordEncoder(passwordEncoder);
        return auth.build();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.authenticationManager(authenticationManager(http))
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/h2-console/**").permitAll()
                        .anyRequest().authenticated()
                )
                        .formLogin(Customizer.withDefaults());

        http.headers(headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::disable));

        return http.build();
    }
}
