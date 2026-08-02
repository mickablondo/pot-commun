import { Component, OnDestroy, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BehaviorSubject, Subject, takeUntil } from "rxjs";
import { ObjectifService } from "../../services/objectif.service";
import { ObjectifProgression } from "../../models/objectif.model";
import { DateFrPipe } from "../../pipes/date-fr.pipe";

@Component({
  selector: "app-historique-objectifs",
  standalone: true,
  imports: [CommonModule, DateFrPipe],
  templateUrl: "./historique-objectifs.component.html",
  styleUrls: ["./historique-objectifs.component.css"],
})
export class HistoriqueObjectifsComponent implements OnInit, OnDestroy {
  objectifsRecuperes$ = new BehaviorSubject<ObjectifProgression[]>([]);
  private readonly destroy$ = new Subject<void>();

  constructor(private objectifService: ObjectifService) {}

  ngOnInit(): void {
    this.charger();
    this.objectifService.refresh$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.charger();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  charger(): void {
    this.objectifService.lister("RECUPERE").subscribe((objectifs) => {
      this.objectifsRecuperes$.next(
        objectifs.sort((a, b) =>
          (b.dateRecuperation ?? "").localeCompare(a.dateRecuperation ?? ""),
        ),
      );
    });
  }
}
