import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, tap } from "rxjs";

/**
 * Interface représentant la réponse de l'API lors de la connexion.
 */
interface LoginResponse {
  token: string | null;
  nom?: string;
}

/**
 * Service d'authentification pour gérer la connexion, la déconnexion et la gestion du token JWT.
 */
@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly TOKEN_KEY = "potcommun_token";

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login(email: string, motDePasse: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>("/api/auth/login", { email, motDePasse })
      .pipe(
        tap((res) => {
          if (res && res.token) {
            localStorage.setItem(this.TOKEN_KEY, res.token);
          }
        }),
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(["/login"]);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
