import {
  Component,
  EventEmitter,
  Output,
  inject,
  ChangeDetectionStrategy,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { GainService } from "../../services/gain.service";
import { SourceGain, SOURCE_GAIN_OPTIONS } from "../../models/gain.model";

@Component({
  selector: "app-ajout-gain",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./ajout-gain.component.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ["./ajout-gain.component.css"],
})
export class AjoutGainComponent {
  @Output() gainAjoute = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private gainService = inject(GainService);

  sourceOptions = SOURCE_GAIN_OPTIONS;

  formulaire = this.fb.group({
    source: [SourceGain.VIDE_GRENIER, Validators.required],
    montant: [
      null as number | null,
      [Validators.required, Validators.min(0.01)],
    ],
    date: [new Date().toISOString().substring(0, 10), Validators.required],
    description: [""],
  });

  soumettre(): void {
    if (this.formulaire.invalid) {
      this.formulaire.markAllAsTouched();
      return;
    }

    const valeurs = this.formulaire.getRawValue();
    this.gainService
      .ajouter({
        source: valeurs.source as SourceGain,
        montant: valeurs.montant as number,
        date: valeurs.date as string,
        description: valeurs.description ?? "",
      })
      .subscribe(() => {
        this.formulaire.reset({
          source: SourceGain.VIDE_GRENIER,
          montant: null,
          date: new Date().toISOString().substring(0, 10),
          description: "",
        });
        this.gainAjoute.emit();
      });
  }
}
