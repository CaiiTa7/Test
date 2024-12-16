
import { Transaction, UserInfo } from "@/types/calculator";
import { RATES } from "@/config/rates";

// Helper function to calculate tax brackets
export function calculateTaxByBracket(revenue: number, brackets: { limite: number, taux: number }[]) {
    let totalTax = 0;
    let remainingRevenue = revenue;

    for (const { limite, taux } of brackets) {
        if (remainingRevenue <= 0) break;
        const taxable = Math.min(remainingRevenue, limite);
        totalTax += taxable * taux;
        remainingRevenue -= taxable;
    }
    return totalTax;
}

// Calculate VAT
export function calculateTVA(transactions: Transaction[]): number {
    return transactions.reduce((sum, t) => sum + (t.type === 'Entrée' ? t.tva : -t.tva), 0);
}

// Calculate social contributions
export function calculateCotisationsSociales(revenuBrut: number, userInfo: UserInfo): number {
    const { statutIndependant, anneeDebutActivite } = userInfo;
    const yearsOfActivity = new Date().getFullYear() - anneeDebutActivite;

    // Early exemptions
    const exemptions = {
        Complémentaire: RATES.COTISATIONS_SOCIALES.complementaire.seuilExemption,
        "Pensionné actif": RATES.COTISATIONS_SOCIALES.pensionneActif.seuilExemption,
    };
    if (statutIndependant in exemptions && revenuBrut <= exemptions[statutIndependant]) {
        return 0;
    }

    // Main contribution calculation
    let cotisation = 0;
    for (const { plafond, taux } of RATES.COTISATIONS_SOCIALES.principal.taux) {
        if (revenuBrut <= plafond) {
            cotisation += revenuBrut * taux;
            break;
        } else {
            cotisation += plafond * taux;
            revenuBrut -= plafond;
        }
    }

    // Reduction for first 3 years
    if (yearsOfActivity <= 3) {
        cotisation *= 0.7;
    }

    return Math.max(cotisation, RATES.COTISATIONS_SOCIALES.principal.cotisationMinimale);
}

// Calculate income tax
export function calculateImpots(revenuImposable: number, userInfo: UserInfo): number {
    const { situationFamiliale, personnesACharge, revenuConjoint } = userInfo;
    let revenuRestant = revenuImposable;

    // Apply marital quotient
    if (situationFamiliale === 'Marié/Cohabitant légal' && revenuConjoint < revenuImposable / 2) {
        const quotient = Math.min(revenuImposable * 0.3, RATES.IMPOTS.quotientConjugalMax);
        revenuRestant -= quotient;
    }

    // Tax calculation using brackets
    const impots = calculateTaxByBracket(revenuRestant, RATES.IMPOTS.tranches);

    // Reduction for dependents
    const reduction = personnesACharge * RATES.IMPOTS.reductionPersonneACharge;

    return Math.max(impots - reduction, 0);
}

// Consolidated totals
export function calculateTotals(transactions: Transaction[], userInfo: UserInfo) {
    const tva = calculateTVA(transactions);
    const revenuBrut = transactions.reduce((sum, t) => sum + (t.type === 'Entrée' ? t.montantHT : 0), 0);
    const cotisationsSoc = calculateCotisationsSociales(revenuBrut, userInfo);
    const impots = calculateImpots(revenuBrut - cotisationsSoc, userInfo);

    return {
        tva,
        cotisationsSoc,
        impots,
        aEpargner: tva + cotisationsSoc + impots,
    };
}
