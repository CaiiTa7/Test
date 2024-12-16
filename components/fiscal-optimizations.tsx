"use client"

import { useState, useMemo, useCallback, Fragment } from 'react'
import { z } from 'zod';
import { UserInfo } from '@/types/calculator'
import { searchInstitutions, ApprovedInstitution } from '@/data/approved-institutions'
import approvedInstitutionsData from '@/data/approved-institutions.json';
import { formatNumber, parseFormattedNumber } from "@/utils/number-formatting"


const approvedInstitutions: ApprovedInstitution[] = approvedInstitutionsData;

const donationSchema = z.object({
  amount: z.number().min(40, "Le don doit être d'au moins 40€ par an et par institution"),
  institution: z.string(),
  registrationNumber: z.string(),
  date: z.string().datetime(),
  hasAttestation: z.boolean(),
});

type DonationDetails = z.infer<typeof donationSchema>;

interface FiscalOptimizationsProps {
  userInfo: UserInfo;
  revenuBrut: number;
}

const optimizationInfo: Record<string, { title: string, description: string, maxAmount?: number }> = {
  pensionEpargne: { 
    title: "Épargne-pension",
    description: "Déduction fiscale pour l'épargne-pension",
    maxAmount: 990
  },
  epargneALongTerme: { 
    title: "Épargne à long terme",
    description: "Déduction fiscale pour l'épargne à long terme",
    maxAmount: 2350
  },
  assuranceVie: { 
    title: "Assurance-vie",
    description: "Déduction fiscale pour les primes d'assurance-vie",
    maxAmount: 2350
  },
  investissementsStartup: { 
    title: "Investissements dans les start-ups",
    description: "Réduction d'impôt pour les investissements dans les jeunes entreprises",
    maxAmount: 100000
  },
  donsAssociations: { 
    title: "Dons aux associations",
    description: "Déduction fiscale pour les dons aux associations agréées",
    maxAmount: 392200
  },
  fraisDomicileProfessionnel: { 
    title: "Frais de domicile professionnel",
    description: "Déduction des frais liés à l'utilisation d'une partie de votre domicile à des fins professionnelles"
  },
};

// Custom Combobox implementation (standalone, no external dependencies)
const CustomCombobox = ({ options, onSelect, placeholder }: { options: { label: string, value: string }[], onSelect: (value: string) => void, placeholder?: string }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        className="w-full border rounded p-2"
      />
      {isOpen && filteredOptions.length > 0 && (
        <ul className="absolute z-10 bg-white border rounded shadow-md mt-1 w-full">
          {filteredOptions.map(option => (
            <li
              key={option.value}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onSelect(option.value);
                setSearchTerm(option.label);
                setIsOpen(false);
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export function FiscalOptimizations({ userInfo, revenuBrut }: FiscalOptimizationsProps) {
  const [optimizations, setOptimizations] = useState<Record<string, boolean>>({
    pensionEpargne: false,
    epargneALongTerme: false,
    assuranceVie: false,
    investissementsStartup: false,
    donsAssociations: false,
    fraisDomicileProfessionnel: false,
  });

  const [optimizationData, setOptimizationData] = useState<Record<string, number>>({
    pensionEpargne: 0,
    epargneALongTerme: 0,
    assuranceVie: 0,
    investissementsStartup: 0,
    fraisDomicileProfessionnel: 0,
  });

  const [donations, setDonations] = useState<DonationDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedInstitutions, setSelectedInstitutions] = useState<Record<string, { amount: number, hasAttestation: boolean }>>({});
  const [donationAmount, setDonationAmount] = useState<number>(0);
  const [hasAttestation, setHasAttestation] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const filteredInstitutions = useMemo(() => {
    return searchInstitutions(searchTerm);
  }, [searchTerm]);

  const handleOptimizationChange = useCallback((key: string, checked: boolean) => {
    setOptimizations(prev => ({ ...prev, [key]: checked }));
  }, []);

  const handleOptimizationDataChange = useCallback((key: string, value: string) => {
    setOptimizationData(prev => ({ ...prev, [key]: parseFormattedNumber(value) }));
  }, []);

  const handleDonationAdd = useCallback((institution: ApprovedInstitution) => {
    setSelectedInstitutions(prev => ({
      ...prev,
      [institution["n° BCE"]]: { amount: 0, hasAttestation: false }
    }));
  }, []);

  const handleDonationRemove = useCallback((registrationNumber: string) => {
    setSelectedInstitutions(prev => {
      const newDonations = { ...prev };
      delete newDonations[registrationNumber];
      return newDonations;
    });
  }, []);

  const handleDonationChange = useCallback((registrationNumber: string, amount: number, hasAttestation: boolean) => {
    setSelectedInstitutions(prev => ({
      ...prev,
      [registrationNumber]: { amount, hasAttestation }
    }));
  }, []);

  const addDonation = useCallback(() => {
    Object.entries(selectedInstitutions).forEach(([registrationNumber, { amount, hasAttestation }]) => {
      const institution = approvedInstitutions.find(inst => inst["n° BCE"] === registrationNumber);

      if (!institution || amount <= 0) return;

      const newDonation = {
        amount,
        institution: institution.Dénomination,
        registrationNumber,
        date: new Date().toISOString(),
        hasAttestation,
      };

      const validationResult = donationSchema.safeParse(newDonation);
      if (!validationResult.success) {
        setErrorMessage(validationResult.error.errors[0].message);
        return;
      }

      const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0) + amount;
      if (totalDonations > revenuBrut * 0.10) {
        setErrorMessage("Le total des dons ne peut pas dépasser 10% des revenus nets");
        return;
      }

      setDonations(prev => [...prev, newDonation]);
    });

    setSelectedInstitutions({});
    setDonationAmount(0);
    setHasAttestation(false);
    setErrorMessage("");
  }, [selectedInstitutions, donations, revenuBrut]);

  const calculateDeduction = useCallback((donation: DonationDetails): number => {
    return donation.amount * 0.45;
  }, []);

  const handleDonationAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseFormattedNumber(e.target.value);
    setDonationAmount(amount);
  };

  return (
    <div className="w-full p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Optimisations Fiscales</h2>
      <div className="space-y-6">
        {Object.entries(optimizations).map(([key, value]) => (
          <div key={key} className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={key}
                checked={value}
                onChange={(e) => handleOptimizationChange(key, e.target.checked)}
              />
              <label htmlFor={key} className="text-gray-700 font-medium">{optimizationInfo[key].title}</label>
            </div>
            {value && (
              <div className="ml-4">
                <label htmlFor={`${key}-amount`} className="block text-sm font-medium text-gray-700">Montant</label>
                {value && optimizationInfo[key].maxAmount && key !== 'donsAssociations' && (
                  <input
                    id={`${key}-amount`}
                    type="text"
                    value={optimizationData[key] === 0 ? '' : formatNumber(optimizationData[key])}
                    onChange={(e) => handleOptimizationDataChange(key, e.target.value)}
                    onFocus={(e) => e.target.select()}
                    className="mt-1 block w-full border rounded p-2"
                    placeholder="Montant en euros"
                  />
                )}
                {key === 'donsAssociations' && (
                  <Input
                    id={`${key}-amount`}
                    type="text"
                    value={optimizationData[key] === 0 ? '' : formatNumber(optimizationData[key])}
                    onChange={(e) => handleOptimizationDataChange(key, e.target.value)}
                    onFocus={(e) => e.target.select()}
                    className="mt-1 block w-full"
                    placeholder="Montant en euros"
                  />
                )}
              </div>
            )}
          </div>
        ))}

        {optimizations.donsAssociations && (
          <div className="ml-4 space-y-4">
            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4">
              <p>À partir du 1er janvier 2024, l'association doit connaître votre prénom, nom, adresse et numéro national pour les dons.</p>
            </div>

            {errorMessage && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p>{errorMessage}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="institution-search" className="block text-sm font-medium text-gray-700">Rechercher une institution</Label>
              <CustomCombobox
                options={filteredInstitutions.map(inst => ({ label: `${inst.Dénomination} (${inst["n° BCE"]})`, value: inst["n° BCE"] }))}
                onSelect={(value) => {
                  const selected = approvedInstitutions.find(inst => inst["n° BCE"] === value);
                  if (selected) {
                    handleDonationAdd(selected);
                    setSearchTerm("");
                  }
                }}
                placeholder="Nom de l'institution"
              />
            </div>

            {Object.keys(selectedInstitutions).length > 0 && (
              <div className="space-y-2">
                {Object.entries(selectedInstitutions).map(([registrationNumber, { amount, hasAttestation }]) => {
                  const institution = approvedInstitutions.find(inst => inst["n° BCE"] === registrationNumber);
                  return (
                    <div key={registrationNumber} className="border p-2 rounded space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{institution?.Dénomination} ({registrationNumber})</span>
                        <Button size="sm" variant="destructive" onClick={() => handleDonationRemove(registrationNumber)}>Supprimer</Button>
                      </div>
                      <div>
                        <Label htmlFor={`${registrationNumber}-amount`} className="block text-sm font-medium text-gray-700">Montant</Label>
                        <Input
                          id={`${registrationNumber}-amount`}
                          type="text"
                          value={formatNumber(amount)}
                          onChange={(e) => handleDonationChange(registrationNumber, parseFormattedNumber(e.target.value), hasAttestation)}
                          onFocus={(e) => e.target.select()}
                          className="mt-1 block w-full"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${registrationNumber}-attestation`}
                          checked={hasAttestation}
                          onCheckedChange={(checked) => handleDonationChange(registrationNumber, amount, checked as boolean)}
                        />
                        <Label htmlFor={`${registrationNumber}-attestation`} className="text-gray-700">J'ai reçu une attestation fiscale</Label>
                      </div>
                    </div>
                  );
                })}
                <Button onClick={addDonation} disabled={Object.values(selectedInstitutions).some(({ amount }) => amount <= 0)}>
                  Ajouter les dons
                </Button>
              </div>
            )}

            {donations.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institution</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Déduction fiscale</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {donations.map((donation, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">{donation.institution}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{formatNumber(donation.amount)} €</td>
                        <td className="px-6 py-4 whitespace-nowrap">{formatNumber(calculateDeduction(donation))} €</td>
                        <td className="px-6 py-4 whitespace-nowrap">{new Date(donation.date).toLocaleDateString('fr-BE')}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={2} className="px-6 py-4 whitespace-nowrap font-bold">Total des déductions</td>
                      <td colSpan={2} className="px-6 py-4 whitespace-nowrap font-bold">
                        {formatNumber(donations.reduce((sum, d) => sum + calculateDeduction(d), 0))} €
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

