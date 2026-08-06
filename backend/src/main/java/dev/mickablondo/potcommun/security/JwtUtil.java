package dev.mickablondo.potcommun.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;

/**
 * JWT utility using JJWT 0.12.x APIs.
 */
@Component
public class JwtUtil {

    private final SecretKey key;
    private final long expirationMs;

    public JwtUtil(@Value("${jwt.secret:changeThisSecretToSomethingSecureChangeMe1234567890}") String secret,
                   @Value("${jwt.expiration-ms:3600000}") long expirationMs) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
    }

    /**
     * Génère un token JWT pour l'utilisateur spécifié.
     * @param username Le nom d'utilisateur pour lequel générer le token
     * @return Le token JWT généré
     */
    public String generateToken(String username) {
        Instant now = Instant.now();

        return Jwts.builder()
                .subject(username)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusMillis(expirationMs)))
                .signWith(key)
                .compact();
    }

    /**
     * Extrait le nom d'utilisateur du token JWT.
     * @param token Le token JWT à partir duquel extraire le nom d'utilisateur
     * @return Le nom d'utilisateur extrait du token, ou null si le token est invalide
     */
    public String extractUsername(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            return claims.getSubject();
        } catch (JwtException e) {
            return null;
        }
    }

    /**
     * Valide le token JWT pour l'utilisateur spécifié.
     * @param token Le token JWT à valider
     * @param username Le nom d'utilisateur à valider
     * @return true si le token est valide pour l'utilisateur, false sinon
     */
    public boolean validateToken(String token, String username) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            return claims.getSubject().equals(username)
                    && claims.getExpiration().after(new Date());
        } catch (JwtException e) {
            return false;
        }
    }
}
