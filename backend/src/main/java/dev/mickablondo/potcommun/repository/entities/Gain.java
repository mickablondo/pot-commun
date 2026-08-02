package dev.mickablondo.potcommun.repository.entities;

import dev.mickablondo.potcommun.model.SourceGain;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Entité représentant un gain dans l'application.
 *
 * @author micka blondo
 */
@Entity
@Table(name = "gain")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Gain {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    private SourceGain source;

    @NotNull
    @Positive
    private BigDecimal montant;

    @NotNull
    private LocalDate date;

    private String description;
}
