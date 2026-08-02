package dev.mickablondo.potcommun.service;

import dev.mickablondo.potcommun.dto.ObjectifProgressionDTO;
import dev.mickablondo.potcommun.repository.entities.Gain;
import dev.mickablondo.potcommun.repository.entities.Objectif;
import dev.mickablondo.potcommun.model.StatutObjectif;
import dev.mickablondo.potcommun.repository.GainRepository;
import dev.mickablondo.potcommun.repository.ObjectifRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FinanceService {

    private final GainRepository gainRepository;
    private final ObjectifRepository objectifRepository;

    /**
     * Solde courant = somme de tous les gains - somme des objectifs déjà récupérés.
     * Peut être négatif si un objectif a été récupéré par anticipation.
     * @return le solde courant
     */
    public BigDecimal getSoldeCourant() {
        BigDecimal totalGains = gainRepository.getTotalGains();
        BigDecimal totalRecupere = objectifRepository.sommeObjectifsRecuperes();
        return totalGains.subtract(totalRecupere);
    }

    /**
     * Récupère la liste de tous les gains enregistrés.
     * @return la liste des gains
     */
    public List<Gain> getGains() {
        return gainRepository.findAll();
    }

    /**
     * Ajoute un nouveau gain à la base de données.
     * @param gain le gain à ajouter
     * @return le gain ajouté avec son identifiant généré
     */
    public Gain addGain(Gain gain) {
        return gainRepository.save(gain);
    }

    /**
     * Supprime un gain de la base de données en fonction de son identifiant.
     * @param id l'identifiant du gain à supprimer
     */
    public void deleteGain(Long id) {
        gainRepository.deleteById(id);
    }

    /**
     * Ajoute un nouvel objectif à la base de données avec le statut "DISPONIBLE" et sans date de récupération.
     * @param objectif l'objectif à ajouter
     * @return l'objectif ajouté avec son identifiant généré
     */
    public Objectif addObjectif(Objectif objectif) {
        return objectifRepository.save(objectif);
    }

    /**
     * Récupère la liste de tous les objectifs avec leur progression calculée en fonction du solde courant.
     * @return la liste des objectifs avec leur progression
     */
    public List<ObjectifProgressionDTO> getObjectifProgressions() {
        BigDecimal solde = getSoldeCourant();
        return objectifRepository.findAll().stream()
                .map(o -> mapToObjectifProgression(o, solde))
                .collect(Collectors.toList());
    }

    /**
     * Récupère la liste des objectifs filtrés par statut avec leur progression calculée en fonction du solde courant.
     * @param statut le statut des objectifs à filtrer (DISPONIBLE ou RECUPERE)
     * @return la liste des objectifs filtrés avec leur progression
     */
    public List<ObjectifProgressionDTO> getObjectifProgressionsByStatut(StatutObjectif statut) {
        BigDecimal solde = getSoldeCourant();
        return objectifRepository.findByStatut(statut).stream()
                .map(o -> mapToObjectifProgression(o, solde))
                .collect(Collectors.toList());
    }

    /**
     * Récupère un objectif par son identifiant : toujours autorisé, même si le solde devient négatif.
     * @param id l'identifiant de l'objectif à récupérer
     * @return l'objectif récupéré avec son statut mis à jour
     */
    public Objectif getObjectif(Long id) {
        Objectif objectif = objectifRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Objectif introuvable: " + id));
        objectif.setStatut(StatutObjectif.RECUPERE);
        objectif.setDateRecuperation(LocalDate.now());
        return objectifRepository.save(objectif);
    }

    //region PRIVATE METHODS

    /**
     * Convertit un objectif en DTO avec le pourcentage de progression calculé.
     * @param o l'objectif à convertir
     * @param solde le solde courant
     * @return le DTO correspondant
     */
    private ObjectifProgressionDTO mapToObjectifProgression(Objectif o, BigDecimal solde) {
        double pourcentage;
        if (o.getPrix().compareTo(BigDecimal.ZERO) <= 0) {
            pourcentage = 100.0;
        } else {
            double ratio = solde.doubleValue() / o.getPrix().doubleValue() * 100.0;
            pourcentage = Math.clamp(ratio, 0.0, 100.0);
        }
        // Un objectif deja récupéré est toujours affiché a 100%
        if (o.getStatut() == StatutObjectif.RECUPERE) {
            pourcentage = 100.0;
        }
        return new ObjectifProgressionDTO(
                o.getId(), o.getNom(), o.getPrix(), o.getStatut(), o.getDateRecuperation(), pourcentage
        );
    }
    //endregion
}
