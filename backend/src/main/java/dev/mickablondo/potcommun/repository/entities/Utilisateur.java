package dev.mickablondo.potcommun.repository.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entité représentant un utilisateur autorisé à accéder à l'application.
 *
 * @author micka blondo
 */
@Entity
@Table(name = "utilisateur")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Email
    @Column(unique = true)
    private String email;

    @NotBlank
    private String motDePasse;

    @NotBlank
    private String nom;
}
