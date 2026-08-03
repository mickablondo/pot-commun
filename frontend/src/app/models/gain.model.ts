export type SourceGain =
  | "VIDE_GRENIER"
  | "VINTED"
  | "CADEAU"
  | "REMBOURSEMENT"
  | "AUTRE";

export interface Gain {
  id?: number;
  source: SourceGain;
  montant: number;
  date: string;
  description?: string;
}
