import { FiscalOptimizations } from '@/types/calculator'
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "./input"
import { Label } from "@/components/ui/label"

interface FiscalOptimizationsFormProps {
  optimizations: FiscalOptimizations;
  onOptimizationsChange: (optimizations: FiscalOptimizations) => void;
}

export function FiscalOptimizationsForm({ optimizations, onOptimizationsChange }: FiscalOptimizationsFormProps) {
  const handleChange = (field: keyof FiscalOptimizations, value: boolean | number) => {
    onOptimizationsChange({
      ...optimizations,
      [field]: value,
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Optimisations Fiscales</h3>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="pensionEpargne"
          checked={optimizations.pensionEpargne}
          onCheckedChange={(checked) => handleChange('pensionEpargne', checked as boolean)}
        />
        <Label htmlFor="pensionEpargne">Épargne-pension</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="epargneALongTerme"
          checked={optimizations.epargneALongTerme}
          onCheckedChange={(checked) => handleChange('epargneALongTerme', checked as boolean)}
        />
        <Label htmlFor="epargneALongTerme">Épargne à long terme</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="assuranceVie"
          checked={optimizations.assuranceVie}
          onCheckedChange={(checked) => handleChange('assuranceVie', checked as boolean)}
        />
        <Label htmlFor="assuranceVie">Assurance-vie</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="investissementsStartup"
          checked={optimizations.investissementsStartup}
          onCheckedChange={(checked) => handleChange('investissementsStartup', checked as boolean)}
        />
        <Label htmlFor="investissementsStartup">Investissements dans les start-ups</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="donsAssociations"
          checked={optimizations.donsAssociations}
          onCheckedChange={(checked) => handleChange('donsAssociations', checked as boolean)}
        />
        <Label htmlFor="donsAssociations">Dons aux associations</Label>
      </div>
      <div className="space-y-2">
        <Label htmlFor="fraisDomicileProfessionnel">Frais de domicile professionnel</Label>
        <Input
          id="fraisDomicileProfessionnel"
          type="number"
          value={optimizations.fraisDomicileProfessionnel}
          onChange={(e) => handleChange('fraisDomicileProfessionnel', parseFloat(e.target.value))}
        />
      </div>
    </div>
  )
}

