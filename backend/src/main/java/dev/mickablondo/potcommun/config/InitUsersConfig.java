package dev.mickablondo.potcommun.config;

import dev.mickablondo.potcommun.repository.UtilisateurRepository;
import dev.mickablondo.potcommun.repository.entities.Utilisateur;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Classe de configuration pour l'initialisation des utilisateurs.
 *
 * @author micka blondo
 */
@Component
@RequiredArgsConstructor
public class InitUsersConfig implements CommandLineRunner {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${INIT_USER_EMAIL}")
    private String initUserEmail;

    @Value("${INIT_USER_PASSWORD}")
    private String initUserPassword;

    @Value("${INIT_USER_NAME}")
    private String initUserName;

    @Override
    public void run(String... args) throws Exception {
        if (utilisateurRepository.count() == 0) {
            utilisateurRepository.save(new Utilisateur(null, initUserEmail, passwordEncoder.encode(initUserPassword), initUserName));
        }
    }
}
