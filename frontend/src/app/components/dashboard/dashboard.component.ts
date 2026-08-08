import {
  Component,
  inject,
  ViewChild,
  ChangeDetectionStrategy,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { JaugeComponent } from "../jauge/jauge.component";
import { AjoutGainComponent } from "../ajout-gain/ajout-gain.component";
import { HistoriqueObjectifsComponent } from "../historique-objectifs/historique-objectifs.component";
import { ObjectifService } from "../../services/objectif.service";
import { HistoriqueGainsComponent } from "../historique-gains/historique-gains.component";

@Component({
  selector: "app-accueil",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    JaugeComponent,
    AjoutGainComponent,
    HistoriqueObjectifsComponent,
    HistoriqueGainsComponent,
  ],
  templateUrl: "./dashboard.component.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent {
  @ViewChild(HistoriqueObjectifsComponent)
  historiqueObjectifs?: HistoriqueObjectifsComponent;

  @ViewChild(HistoriqueGainsComponent)
  historiqueGains?: HistoriqueGainsComponent;

  private fb = inject(FormBuilder);
  private objectifService = inject(ObjectifService);

  // Incremente pour forcer la jauge et l'historique a se rafraichir apres une action
  compteurRafraichissement = 0;

  formulaireObjectif = this.fb.group({
    nom: ["", Validators.required],
    prix: [null as number | null, [Validators.required, Validators.min(0.01)]],
  });

  surAjoutGain(): void {
    this.compteurRafraichissement++;
    // Rafraîchissement ciblé : demande au composant d'historique des gains
    // de recharger sa liste et incrémente le compteur pour la jauge.
    this.historiqueGains?.charger();
  }

  surRecuperationObjectif(): void {
    this.compteurRafraichissement++;
    this.historiqueObjectifs?.charger();
  }

  ajouterObjectif(): void {
    if (this.formulaireObjectif.invalid) {
      this.formulaireObjectif.markAllAsTouched();
      return;
    }
    const valeurs = this.formulaireObjectif.getRawValue();
    this.objectifService
      .ajouter({ nom: valeurs.nom as string, prix: valeurs.prix as number })
      .subscribe(() => {
        this.formulaireObjectif.reset();
        this.compteurRafraichissement++;
      });
  }
}
