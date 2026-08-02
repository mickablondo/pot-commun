package dev.mickablondo.potcommun.repository;

import dev.mickablondo.potcommun.repository.entities.Gain;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;

/**
 * Repository pour l'entité Gain
 *
 * @author micka blondo
 */
public interface GainRepository extends JpaRepository<Gain, Long> {

    @Query("SELECT COALESCE(SUM(g.montant), 0) FROM Gain g")
    BigDecimal getTotalGains();
}
