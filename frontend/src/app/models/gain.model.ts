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

export const getSourceGainLabel = (source: SourceGain): string =>
  SOURCE_GAIN_LABELS[source] ?? source;

export interface Gain {
  id?: number;
  source: SourceGain;
  montant: number;
  date: string;
  description?: string;
}
