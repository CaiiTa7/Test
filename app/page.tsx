import { TreasuryCalculator } from "@/components/treasury-calculator"

export default function Home() {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();

  return (
    <main className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-6">Calculateur Fiscal pour Indépendants Belges</h1>
      <TreasuryCalculator 
        month={currentMonth}
        year={currentYear}
      />
    </main>
  )
}

