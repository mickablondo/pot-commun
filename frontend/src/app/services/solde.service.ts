import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

const API_URL = 'http://localhost:8080/api/solde';

@Injectable({ providedIn: 'root' })
export class SoldeService {
  private soldeSubject = new BehaviorSubject<number>(0);
  solde$ = this.soldeSubject.asObservable();

  constructor(private http: HttpClient) {}

  rafraichir(): void {
    this.http.get<{ solde: number }>(API_URL)
      .pipe(tap((reponse) => this.soldeSubject.next(reponse.solde)))
      .subscribe();
  }
}
