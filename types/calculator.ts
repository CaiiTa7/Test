import { z } from 'zod';

export const transactionSchema = z.object({
  id: z.string(),
  date: z.string().datetime(),
  designation: z.string(),
  type: z.enum(['Entrée', 'Sortie']),
  montantTVAC: z.number(),
  tauxTVA: z.number(),
  frais: z.number(),
  montantHT: z.number(),
  tva: z.number(),
});

export const balanceSchema = z.object({
  comptePro: z.number(),
  compteEpargne: z.number(),
  comptePrive: z.number(),
});

export const userInfoSchema = z.object({
  statutIndependant: z.enum(['Principal', 'Complémentaire', 'Pensionné actif']),
  anneeDebutActivite: z.number(),
  situationFamiliale: z.enum(['Isolé', 'Marié/Cohabitant légal']),
  personnesACharge: z.number(),
  revenuConjoint: z.number(),
  autresRevenus: z.number(),
  fraisProfessionnels: z.enum(['Forfaitaires', 'Réels']),
  fraisProfessionnelsReels: z.number(),
});

export const totalsSchema = z.object({
  tva: z.number(),
  cotisationsSoc: z.number(),
  impots: z.number(),
  aEpargner: z.number(),
});

export const monthlyDataSchema = z.object({
  transactions: z.array(transactionSchema),
  balances: balanceSchema,
  userInfo: userInfoSchema,
  totals: totalsSchema,
});

export const yearlyDataSchema = z.record(z.string(), monthlyDataSchema);

export const fiscalOptimizationsSchema = z.object({
  pensionEpargne: z.boolean(),
  epargneALongTerme: z.boolean(),
  assuranceVie: z.boolean(),
  investissementsStartup: z.boolean(),
  donsAssociations: z.boolean(),
  fraisDomicileProfessionnel: z.number(),
});

export const userProfileSchema = z.object({
  userInfo: userInfoSchema,
  optimizations: fiscalOptimizationsSchema,
});


export type Transaction = z.infer<typeof transactionSchema>;
export type Balance = z.infer<typeof balanceSchema>;
export type UserInfo = z.infer<typeof userInfoSchema>;
export type Totals = z.infer<typeof totalsSchema>;
export type MonthlyData = z.infer<typeof monthlyDataSchema>;
export type YearlyData = z.infer<typeof yearlyDataSchema>;
export type FiscalOptimizations = z.infer<typeof fiscalOptimizationsSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;

