import { UserInfo } from '@/types/calculator'
import { Input } from "./input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface UserInfoFormProps {
  userInfo: UserInfo;
  onUserInfoChange: (field: keyof UserInfo, value: any) => void;
}

export function UserInfoForm({ userInfo, onUserInfoChange }: UserInfoFormProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="statutIndependant">Statut d'indépendant</Label>
        <Select
          value={userInfo.statutIndependant}
          onValueChange={(value) => onUserInfoChange('statutIndependant', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Principal">Principal</SelectItem>
            <SelectItem value="Complémentaire">Complémentaire</SelectItem>
            <SelectItem value="Pensionné actif">Pensionné actif</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="anneeDebutActivite">Année de début d'activité</Label>
        <Input
          type="number"
          value={userInfo.anneeDebutActivite === 0 ? '' : userInfo.anneeDebutActivite}
          onChange={(e) => onUserInfoChange('anneeDebutActivite', parseInt(e.target.value))}
          onFocus={(e) => {
            e.target.value = '';
            e.target.select();
          }}
        />
      </div>
      <div>
        <Label htmlFor="situationFamiliale">Situation familiale</Label>
        <Select
          value={userInfo.situationFamiliale}
          onValueChange={(value) => onUserInfoChange('situationFamiliale', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Isolé">Isolé</SelectItem>
            <SelectItem value="Marié/Cohabitant légal">Marié/Cohabitant légal</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="personnesACharge">Personnes à charge</Label>
        <Input
          type="number"
          value={userInfo.personnesACharge === 0 ? '' : userInfo.personnesACharge}
          onChange={(e) => onUserInfoChange('personnesACharge', parseInt(e.target.value))}
          onFocus={(e) => {
            e.target.value = '';
            e.target.select();
          }}
        />
      </div>
      <div>
        <Label htmlFor="revenuConjoint">Revenu du conjoint</Label>
        <Input
          type="number"
          value={userInfo.revenuConjoint === 0 ? '' : userInfo.revenuConjoint}
          onChange={(e) => onUserInfoChange('revenuConjoint', parseFloat(e.target.value))}
          onFocus={(e) => {
            e.target.value = '';
            e.target.select();
          }}
        />
      </div>
      <div>
        <Label htmlFor="autresRevenus">Autres revenus</Label>
        <Input
          type="number"
          value={userInfo.autresRevenus === 0 ? '' : userInfo.autresRevenus}
          onChange={(e) => onUserInfoChange('autresRevenus', parseFloat(e.target.value))}
          onFocus={(e) => {
            e.target.value = '';
            e.target.select();
          }}
        />
      </div>
      <div>
        <Label htmlFor="fraisProfessionnels">Frais professionnels</Label>
        <Select
          value={userInfo.fraisProfessionnels}
          onValueChange={(value) => onUserInfoChange('fraisProfessionnels', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Forfaitaires">Forfaitaires</SelectItem>
            <SelectItem value="Réels">Réels</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {userInfo.fraisProfessionnels === 'Réels' && (
        <div>
          <Label htmlFor="fraisProfessionnelsReels">Montant des frais réels</Label>
          <Input
            type="number"
            value={userInfo.fraisProfessionnelsReels === 0 ? '' : userInfo.fraisProfessionnelsReels}
            onChange={(e) => onUserInfoChange('fraisProfessionnelsReels', parseFloat(e.target.value))}
            onFocus={(e) => {
              e.target.value = '';
              e.target.select();
            }}
          />
        </div>
      )}
    </div>
  )
}

