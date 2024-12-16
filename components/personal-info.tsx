"use client"

import { useState } from 'react'
import { z } from 'zod'
import { UserInfo } from '@/types/calculator'
import { Input } from "./input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { formatNumber, parseFormattedNumber } from "@/utils/number-formatting"

const userInfoSchema = z.object({
  statutIndependant: z.enum(['Principal', 'Complémentaire', 'Pensionné actif']),
  anneeDebutActivite: z.number().int().positive(),
  situationFamiliale: z.enum(['Isolé', 'Marié/Cohabitant légal']),
  personnesACharge: z.number().int().nonnegative(),
  revenuConjoint: z.number().nonnegative(),
  autresRevenus: z.number().nonnegative(),
  fraisProfessionnels: z.enum(['Forfaitaires', 'Réels']),
  fraisProfessionnelsReels: z.number().nonnegative(),
});

interface PersonalInfoProps {
  initialUserInfo: UserInfo
  onUserInfoChange: (userInfo: UserInfo) => void
}

export function PersonalInfo({ initialUserInfo, onUserInfoChange }: PersonalInfoProps) {
  const [userInfo, setUserInfo] = useState<UserInfo>(initialUserInfo)
  const [errors, setErrors] = useState<Partial<Record<keyof UserInfo, string>>>({})

  const handleChange = (field: keyof UserInfo, value: string | number) => {
    const newUserInfo = { ...userInfo, [field]: value }
    setUserInfo(newUserInfo)

    try {
      userInfoSchema.parse(newUserInfo)
      setErrors({})
      onUserInfoChange(newUserInfo)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof UserInfo, string>> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof UserInfo] = err.message
          }
        })
        setErrors(newErrors)
      }
    }
  }

  return (
    <div className="w-full p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Informations Personnelles</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="statutIndependant">Statut d'indépendant</Label>
          <Select
            value={userInfo.statutIndependant}
            onValueChange={(value) => handleChange('statutIndependant', value)}
          >
            <SelectTrigger id="statutIndependant">
              <SelectValue placeholder="Sélectionnez votre statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Principal">Principal</SelectItem>
              <SelectItem value="Complémentaire">Complémentaire</SelectItem>
              <SelectItem value="Pensionné actif">Pensionné actif</SelectItem>
            </SelectContent>
          </Select>
          {errors.statutIndependant && <p className="text-red-500 text-sm mt-1">{errors.statutIndependant}</p>}
        </div>

        <div>
          <Label htmlFor="anneeDebutActivite">Année de début d'activité</Label>
          <Input
            id="anneeDebutActivite"
            type="text"
            value={formatNumber(userInfo.anneeDebutActivite)}
            onChange={(e) => {
              const value = parseFormattedNumber(e.target.value);
              handleChange('anneeDebutActivite', value);
            }}
            onFocus={(e) => e.target.select()}
          />
          {errors.anneeDebutActivite && <p className="text-red-500 text-sm mt-1">{errors.anneeDebutActivite}</p>}
        </div>

        <div>
          <Label htmlFor="situationFamiliale">Situation familiale</Label>
          <Select
            value={userInfo.situationFamiliale}
            onValueChange={(value) => handleChange('situationFamiliale', value)}
          >
            <SelectTrigger id="situationFamiliale">
              <SelectValue placeholder="Sélectionnez votre situation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Isolé">Isolé</SelectItem>
              <SelectItem value="Marié/Cohabitant légal">Marié/Cohabitant légal</SelectItem>
            </SelectContent>
          </Select>
          {errors.situationFamiliale && <p className="text-red-500 text-sm mt-1">{errors.situationFamiliale}</p>}
        </div>

        <div>
          <Label htmlFor="personnesACharge">Personnes à charge</Label>
          <Input
            id="personnesACharge"
            type="text"
            value={formatNumber(userInfo.personnesACharge)}
            onChange={(e) => {
              const value = parseFormattedNumber(e.target.value);
              handleChange('personnesACharge', value);
            }}
            onFocus={(e) => e.target.select()}
          />
          {errors.personnesACharge && <p className="text-red-500 text-sm mt-1">{errors.personnesACharge}</p>}
        </div>

        <div>
          <Label htmlFor="revenuConjoint">Revenu du conjoint</Label>
          <Input
            id="revenuConjoint"
            type="text"
            value={formatNumber(userInfo.revenuConjoint)}
            onChange={(e) => {
              const value = parseFormattedNumber(e.target.value);
              handleChange('revenuConjoint', value);
            }}
            onFocus={(e) => e.target.select()}
          />
          {errors.revenuConjoint && <p className="text-red-500 text-sm mt-1">{errors.revenuConjoint}</p>}
        </div>

        <div>
          <Label htmlFor="autresRevenus">Autres revenus</Label>
          <Input
            id="autresRevenus"
            type="text"
            value={formatNumber(userInfo.autresRevenus)}
            onChange={(e) => {
              const value = parseFormattedNumber(e.target.value);
              handleChange('autresRevenus', value);
            }}
            onFocus={(e) => e.target.select()}
          />
          {errors.autresRevenus && <p className="text-red-500 text-sm mt-1">{errors.autresRevenus}</p>}
        </div>

        <div>
          <Label htmlFor="fraisProfessionnels">Frais professionnels</Label>
          <Select
            value={userInfo.fraisProfessionnels}
            onValueChange={(value) => handleChange('fraisProfessionnels', value)}
          >
            <SelectTrigger id="fraisProfessionnels">
              <SelectValue placeholder="Sélectionnez le type de frais" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Forfaitaires">Forfaitaires</SelectItem>
              <SelectItem value="Réels">Réels</SelectItem>
            </SelectContent>
          </Select>
          {errors.fraisProfessionnels && <p className="text-red-500 text-sm mt-1">{errors.fraisProfessionnels}</p>}
        </div>

        {userInfo.fraisProfessionnels === 'Réels' && (
          <div>
            <Label htmlFor="fraisProfessionnelsReels">Montant des frais réels</Label>
            <Input
              id="fraisProfessionnelsReels"
              type="text"
              value={formatNumber(userInfo.fraisProfessionnelsReels)}
              onChange={(e) => {
                const value = parseFormattedNumber(e.target.value);
                handleChange('fraisProfessionnelsReels', value);
              }}
              onFocus={(e) => e.target.select()}
            />
            {errors.fraisProfessionnelsReels && <p className="text-red-500 text-sm mt-1">{errors.fraisProfessionnelsReels}</p>}
          </div>
        )}
      </div>
    </div>
  )
}

