import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Gain } from "../models/gain.model";

const API_URL = "http://localhost:8080/api/gains";

@Injectable({ providedIn: "root" })
export class GainService {
  constructor(private http: HttpClient) {}

  lister(): Observable<Gain[]> {
    return this.http.get<Gain[]>(API_URL);
  }

  ajouter(gain: Gain): Observable<Gain> {
    return this.http.post<Gain>(API_URL, gain);
  }

  supprimer(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${id}`);
  }
}
