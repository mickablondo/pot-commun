import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import {
  Objectif,
  ObjectifProgression,
  StatutObjectif,
} from "../models/objectif.model";

const API_URL = "http://localhost:8080/api/objectifs";

@Injectable({ providedIn: "root" })
export class ObjectifService {
  private refreshSubject = new Subject<void>();
  refresh$ = this.refreshSubject.asObservable();

  constructor(private http: HttpClient) {}

  lister(statut?: StatutObjectif): Observable<ObjectifProgression[]> {
    const url = statut ? `${API_URL}?statut=${statut}` : API_URL;
    return this.http.get<ObjectifProgression[]>(url);
  }

  ajouter(objectif: Objectif): Observable<Objectif> {
    return this.http.post<Objectif>(API_URL, objectif);
  }

  recuperer(id: number): Observable<Objectif> {
    return this.http.post<Objectif>(`${API_URL}/${id}/recuperer`, {});
  }

  notifyRefresh(): void {
    this.refreshSubject.next();
  }
}
