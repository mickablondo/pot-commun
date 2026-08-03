import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  inject,
  ChangeDetectionStrategy,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { SoldeService } from "../../services/solde.service";
import { ObjectifService } from "../../services/objectif.service";
import { ObjectifProgression } from "../../models/objectif.model";
import { EuroFrPipe } from "../../pipes/euro-fr.pipe";

@Component({
  selector: "app-jauge",
  standalone: true,
  imports: [CommonModule, EuroFrPipe],
  templateUrl: "./jauge.component.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ["./jauge.component.css"],
})
export class JaugeComponent implements OnInit, OnChanges {
  @Input() declencheurRafraichissement = 0;
  @Output() objectifRecupere = new EventEmitter<void>();

  solde = 0;
  objectifsDisponibles: ObjectifProgression[] = [];

  // Echelle de la jauge = le prix de l'objectif le plus cher, pour que tous les reperes rentrent
  get echelleMax(): number {
    if (this.objectifsDisponibles.length === 0) return 1;
    return Math.max(
      ...this.objectifsDisponibles.map((o) => o.prix),
      this.solde,
    );
  }

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly ngZone = inject(NgZone);

  constructor(
    private soldeService: SoldeService,
    private objectifService: ObjectifService,
  ) {}

  ngOnInit(): void {
    this.charger();
  }

  ngOnChanges(_: SimpleChanges): void {
    this.charger();
  }

  charger(): void {
    this.soldeService.rafraichir();
    this.soldeService.solde$.subscribe((solde) => {
      this.solde = solde;
    });

    this.objectifService.lister("DISPONIBLE").subscribe({
      next: (objectifs) => {
        this.ngZone.run(() => {
          this.objectifsDisponibles = objectifs.sort((a, b) => a.prix - b.prix);
          this.cdr.detectChanges();
        });
      },
      error: (error) => {
        console.error("Erreur lors du chargement des objectifs", error);
      },
    });
  }

  // Position du curseur de solde en % sur la jauge (borne a 100)
  positionSolde(): number {
    return Math.min(100, Math.max(0, (this.solde / this.echelleMax) * 100));
  }

  // Position d'un repere d'objectif en % sur la jauge
  positionRepere(objectif: ObjectifProgression): number {
    return Math.min(100, (objectif.prix / this.echelleMax) * 100);
  }

  recuperer(objectif: ObjectifProgression): void {
    const confirmation = confirm(
      `Récupérer "${objectif.nom}" (${objectif.prix} EUR) ? Ton solde deviendra ${(
        this.solde - objectif.prix
      ).toFixed(2)} EUR.`,
    );
    if (!confirmation) return;

    this.objectifService.recuperer(objectif.id).subscribe(() => {
      this.charger();
      this.objectifService.notifyRefresh();
      this.objectifRecupere.emit();
    });
  }
}
