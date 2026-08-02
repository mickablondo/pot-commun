package dev.mickablondo.potcommun.repository;

import dev.mickablondo.potcommun.repository.entities.Objectif;
import dev.mickablondo.potcommun.model.StatutObjectif;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;

/**
 * Repository pour l'entité Objectif
 *
 * @author micka blondo
 */
public interface ObjectifRepository extends JpaRepository<Objectif, Long> {

    /**
     * Récupère la liste des objectifs en fonction de leur statut
     * @param statut statut de l'objectif (DISPONIBLE ou RECUPERE)
     * @return liste des objectifs correspondant au statut donné
     */
    List<Objectif> findByStatut(StatutObjectif statut);

    /**
     * Calcule la somme des prix des objectifs ayant le statut "RECUPERE"
     * @return la somme des prix des objectifs récupérés, ou 0 si aucun objectif n'a été récupéré
     */
    @Query("SELECT COALESCE(SUM(o.prix), 0) FROM Objectif o WHERE o.statut = 'RECUPERE'")
    BigDecimal sommeObjectifsRecuperes();
}
