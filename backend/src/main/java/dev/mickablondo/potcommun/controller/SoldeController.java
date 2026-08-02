package dev.mickablondo.potcommun.controller;

import dev.mickablondo.potcommun.service.FinanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.Map;

/**
 * Contrôleur REST pour gérer les opérations liées au solde financier.
 * Il fournit un endpoint pour obtenir le solde courant.
 *
 * @author micka blondo
 */
@RestController
@RequestMapping("/api/solde")
@RequiredArgsConstructor
public class SoldeController {

    private final FinanceService financeService;

    @GetMapping
    public Map<String, BigDecimal> obtenirSolde() {
        return Map.of("solde", financeService.getSoldeCourant());
    }
}
