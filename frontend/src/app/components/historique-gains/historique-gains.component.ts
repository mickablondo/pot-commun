import { Component, OnDestroy, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { Gain } from "../../models/gain.model";
import { BehaviorSubject, Subject } from "rxjs";
import { GainService } from "../../services/gain.service";
import { CommonModule } from "@angular/common";
import { DateFrPipe } from "../../pipes/date-fr.pipe";
import { EuroFrPipe } from "../../pipes/euro-fr.pipe";

@Component({
  selector: "app-historique-gains",
  imports: [CommonModule, DateFrPipe, EuroFrPipe],
  templateUrl: "./historique-gains.component.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: "./historique-gains.component.css",
})
export class HistoriqueGainsComponent implements OnInit, OnDestroy {
  gainsRecuperes$ = new BehaviorSubject<Gain[]>([]);
  private readonly destroy$ = new Subject<void>();

  constructor(private gainService: GainService) {}

  ngOnInit(): void {
    this.charger();
  }

  charger(): void {
    this.gainService.lister().subscribe({
      next: (gains) =>
        this.gainsRecuperes$.next(
          gains.sort((a, b) => (b.date ?? "").localeCompare(a.date ?? "")),
        ),
      error: (error) =>
        console.error("Erreur lors du chargement des gains:", error),
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
