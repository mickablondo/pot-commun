package dev.mickablondo.potcommun.controller;

import dev.mickablondo.potcommun.repository.entities.Gain;
import dev.mickablondo.potcommun.service.FinanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Contrôleur REST pour gérer les gains financiers.
 * Fournit des endpoints pour lister, ajouter et supprimer des gains.
 *
 * @author micka blondo
 */
@RestController
@RequestMapping("/api/gains")
@RequiredArgsConstructor
public class GainController {

    private final FinanceService financeService;

    @GetMapping
    public List<Gain> lister() {
        return financeService.getGains();
    }

    @PostMapping
    public Gain ajouter(@Valid @RequestBody Gain gain) {
        return financeService.addGain(gain);
    }

    @DeleteMapping("/{id}")
    public void supprimer(@PathVariable Long id) {
        financeService.deleteGain(id);
    }
}
