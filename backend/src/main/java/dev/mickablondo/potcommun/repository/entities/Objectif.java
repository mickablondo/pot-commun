package dev.mickablondo.potcommun.repository.entities;

import dev.mickablondo.potcommun.model.StatutObjectif;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Entité représentant un objectif dans l'application.
 *
 * @author micka blondo
 */
@Setter
@Getter
@Entity
@Table(name = "objectif")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Objectif {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String nom;

    @NotNull
    @Positive
    private BigDecimal prix;

    @NotNull
    @Enumerated(EnumType.STRING)
    private StatutObjectif statut = StatutObjectif.DISPONIBLE;

    private LocalDate dateRecuperation;
}
