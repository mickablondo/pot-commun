export enum SourceGain {
  VIDE_GRENIER = "VIDE_GRENIER",
  VINTED = "VINTED",
  CADEAU = "CADEAU",
  REMBOURSEMENT = "REMBOURSEMENT",
  AUTRE = "AUTRE",
}

export const SOURCE_GAIN_LABELS: Record<SourceGain, string> = {
  [SourceGain.VIDE_GRENIER]: "Vide grenier",
  [SourceGain.VINTED]: "Vinted",
  [SourceGain.CADEAU]: "Cadeau",
  [SourceGain.REMBOURSEMENT]: "Remboursement",
  [SourceGain.AUTRE]: "Autre",
};

export const SOURCE_GAIN_OPTIONS: Array<{ value: SourceGain; label: string }> =
  (Object.values(SourceGain) as SourceGain[]).map((source) => ({
    value: source,
    label: SOURCE_GAIN_LABELS[source],
  }));

export const SOURCE_GAIN_COLORS: Record<SourceGain, string> = {
  [SourceGain.VIDE_GRENIER]: "#2f80ed",
  [SourceGain.VINTED]: "#27ae60",
  [SourceGain.CADEAU]: "#f2994a",
  [SourceGain.REMBOURSEMENT]: "#eb5757",
  [SourceGain.AUTRE]: "#9b51e0",
};

export const getSourceGainLabel = (source: SourceGain): string =>
  SOURCE_GAIN_LABELS[source] ?? source;

export const getSourceGainColor = (source: SourceGain): string =>
  SOURCE_GAIN_COLORS[source] ?? "#8899aa";

export interface Gain {
  id?: number;
  source: SourceGain;
  montant: number;
  date: string;
  description?: string;
}
