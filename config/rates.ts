export const RATES = {
  TVA: {
    standard: 21,
    reduit: 6,
    intermediaire: 12,
  },
  COTISATIONS_SOCIALES: {
    principal: {
      taux: [
        { plafond: 60427.75, taux: 0.2068 },
        { plafond: 89051.37, taux: 0.1416 },
        { plafond: Infinity, taux: 0.1207 },
      ],
      cotisationMinimale: 785.34,
    },
    complementaire: {
      seuilExemption: 1621.72,
      cotisationMinimale: 82.05,
    },
    pensionneActif: {
      seuilExemption: 3107.24,
      cotisationMinimale: 116.46,
    },
  },
  IMPOTS: {
    tranches: [
      { limite: 13870, taux: 0.25 },
      { limite: 24480, taux: 0.40 },
      { limite: 42370, taux: 0.45 },
      { limite: Infinity, taux: 0.50 },
    ],
    reductionPersonneACharge: 1650,
    quotientConjugalMax: 11450,
  },
  FRAIS_PROFESSIONNELS: {
    forfaitaires: [
      { limite: 16400, taux: 0.3 },
      { limite: 32200, montantFixe: 4920, tauxMarginal: 0.11 },
      { limite: Infinity, montantFixe: 6700, tauxMarginal: 0 },
    ],
  },
};

