package dev.mickablondo.potcommun.controller;

import dev.mickablondo.potcommun.dto.LoginRequestDTO;
import dev.mickablondo.potcommun.dto.LoginResponseDTO;
import dev.mickablondo.potcommun.repository.UtilisateurRepository;
import dev.mickablondo.potcommun.repository.entities.Utilisateur;
import dev.mickablondo.potcommun.security.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Contrôleur REST pour gérer l'authentification des utilisateurs.
 *
 * @author micka blondo
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UtilisateurRepository utilisateurRepository;
    private final JwtUtil jwtUtil;

    /**
     * Endpoint pour l'authentification des utilisateurs.
     * @param dto Les informations de connexion (email et mot de passe).
     * @return Une réponse contenant le token JWT et le nom de l'utilisateur si l'authentification est réussie.
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO dto) {
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword());
        Authentication auth = authenticationManager.authenticate(authToken);
        SecurityContextHolder.getContext().setAuthentication(auth);

        Utilisateur u = utilisateurRepository.findByEmail(dto.getEmail()).orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        String token = jwtUtil.generateToken(u.getEmail());
        return ResponseEntity.ok(new LoginResponseDTO(token, u.getNom()));
    }
}
