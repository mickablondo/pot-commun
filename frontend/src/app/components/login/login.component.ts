import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";

/**
 * Composant de connexion pour gérer l'authentification des utilisateurs.
 */
@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    motDePasse: ["", Validators.required],
  });

  errorMessage: string | null = null;
  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.errorMessage = null;
    const v = this.form.getRawValue();
    this.auth.login(v.email!, v.motDePasse!).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigateByUrl("/");
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = "Échec de l’authentification";
        console.error(err);
      },
    });
  }
}
