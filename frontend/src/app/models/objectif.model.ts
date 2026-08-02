export type StatutObjectif = 'DISPONIBLE' | 'RECUPERE';

export interface Objectif {
  id?: number;
  nom: string;
  prix: number;
}

export interface ObjectifProgression {
  id: number;
  nom: string;
  prix: number;
  statut: StatutObjectif;
  dateRecuperation: string | null;
  pourcentageAtteint: number;
}
