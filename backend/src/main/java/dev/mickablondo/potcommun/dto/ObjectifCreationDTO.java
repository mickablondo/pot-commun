package dev.mickablondo.potcommun.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

/**
 * DTO pour la création d'un objectif.
 *
 * @author micka blondo
 */
@Getter
@Setter
public class ObjectifCreationDTO {

    @NotBlank
    private String nom;

    @NotNull
    @Positive
    private BigDecimal prix;
}
