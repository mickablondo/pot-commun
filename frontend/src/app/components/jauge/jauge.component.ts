import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  inject,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { Chart, type ChartOptions } from "chart.js/auto";
import { SoldeService } from "../../services/solde.service";
import { GainService } from "../../services/gain.service";
import {
  Gain,
  SourceGain,
  getSourceGainColor,
  getSourceGainLabel,
} from "../../models/gain.model";
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

  @ViewChild("chartCanvas") private chartCanvas?: ElementRef<HTMLCanvasElement>;

  modalOuvert = false;
  distributionLabels: string[] = [];
  distributionValues: number[] = [];
  private chart?: Chart<"doughnut">;

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly ngZone = inject(NgZone);

  constructor(
    private soldeService: SoldeService,
    private objectifService: ObjectifService,
    private gainService: GainService,
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

    this.chargerDistribution();
  }

  ouvrirModal(): void {
    this.modalOuvert = true;
    this.cdr.detectChanges();
    setTimeout(() => this.creerGraphique());
  }

  fermerModal(): void {
    this.modalOuvert = false;
    this.chart?.destroy();
    this.chart = undefined;
  }

  private chargerDistribution(): void {
    this.gainService.lister().subscribe({
      next: (gains) => {
        const totaux = Object.values(SourceGain).reduce(
          (acc, source) => {
            acc[source] = 0;
            return acc;
          },
          {} as Record<SourceGain, number>,
        );

        gains.forEach((gain) => {
          totaux[gain.source] = (totaux[gain.source] ?? 0) + gain.montant;
        });

        this.distributionLabels =
          Object.values(SourceGain).map(getSourceGainLabel);
        this.distributionValues = Object.values(SourceGain).map((source) =>
          Number((totaux[source] ?? 0).toFixed(2)),
        );

        if (this.modalOuvert) {
          this.creerGraphique();
        }
      },
      error: (error) => {
        console.error("Erreur lors du chargement des gains", error);
      },
    });
  }

  hasDistributionData(): boolean {
    return this.distributionValues.some((value) => value > 0);
  }

  private creerGraphique(): void {
    if (!this.modalOuvert) {
      return;
    }

    const canvas = this.chartCanvas?.nativeElement;
    if (!canvas) {
      return;
    }

    const labels: string[] = [];
    const values: number[] = [];
    const colors: string[] = [];
    const sources = Object.values(SourceGain) as SourceGain[];

    sources.forEach((source, index) => {
      const value = this.distributionValues[index];
      if (value > 0) {
        labels.push(this.distributionLabels[index]);
        values.push(value);
        colors.push(getSourceGainColor(source));
      }
    });

    this.chart?.destroy();
    this.chart = new Chart(canvas, {
      type: "doughnut",
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: colors,
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              boxWidth: 14,
              padding: 16,
            },
          },
          tooltip: {
            callbacks: {
              label: (context) =>
                `${context.label}: ${context.formattedValue} €`,
            },
          },
        },
      } as ChartOptions<"doughnut">,
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
