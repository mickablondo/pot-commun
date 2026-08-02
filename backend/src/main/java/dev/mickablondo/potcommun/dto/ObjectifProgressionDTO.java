package dev.mickablondo.potcommun.dto;

import dev.mickablondo.potcommun.model.StatutObjectif;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO représentant la progression d'un objectif.
 *
 * @author micka blondo
 */
@Getter
@AllArgsConstructor
public class ObjectifProgressionDTO {

    private Long id;
    private String nom;
    private BigDecimal prix;
    private StatutObjectif statut;
    private LocalDate dateRecuperation;
    private double pourcentageAtteint;
}
