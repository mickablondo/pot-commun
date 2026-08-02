package dev.mickablondo.potcommun.controller;

import dev.mickablondo.potcommun.dto.ObjectifCreationDTO;
import dev.mickablondo.potcommun.dto.ObjectifProgressionDTO;
import dev.mickablondo.potcommun.repository.entities.Objectif;
import dev.mickablondo.potcommun.model.StatutObjectif;
import dev.mickablondo.potcommun.service.FinanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Contrôleur REST pour gérer les objectifs financiers.
 * Fournit des endpoints pour lister, ajouter et récupérer des objectifs.
 *
 * @author micka blondo
 */
@RestController
@RequestMapping("/api/objectifs")
@RequiredArgsConstructor
public class ObjectifController {

    private final FinanceService financeService;

    @GetMapping
    public List<ObjectifProgressionDTO> lister(@RequestParam(required = false) StatutObjectif statut) {
        if (statut != null) {
            return financeService.getObjectifProgressionsByStatut(statut);
        }
        return financeService.getObjectifProgressions();
    }

    @PostMapping
    public Objectif ajouter(@Valid @RequestBody ObjectifCreationDTO objectif) {
        return financeService.addObjectif(Objectif.builder()
                .nom(objectif.getNom())
                .prix(objectif.getPrix())
                .statut(StatutObjectif.DISPONIBLE)
                .dateRecuperation(null)
                .build());
    }

    @PostMapping("/{id}/recuperer")
    public Objectif recuperer(@PathVariable Long id) {
        return financeService.getObjectif(id);
    }
}
