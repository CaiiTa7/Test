"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table"
import { Input } from "./input"
import { Button } from "./button"
import type { DepreciationItem } from "../types/calculator"

interface NextYearItem {
  libelle: string
  valeur: number
  quotitePro: number
  pourcentage: number
  frais: number
}

export function Depreciation({ year }: { year: number }) {
  const [items, setItems] = useState<DepreciationItem[]>([])
  const [nextYearItems, setNextYearItems] = useState<NextYearItem[]>([])

  const calculatePeriods = (pa: number, tx: number, annee: number) => {
    const periodAmount = pa / annee
    const periods = Array(annee).fill(periodAmount)
    const cumul = pa
    const vnc = 0
    return { periods, cumul, vnc }
  }

  const addItem = () => {
    const newItem: DepreciationItem = {
      annee: 1,
      libelle: "",
      tx: 33,
      pa: 0,
      periods: [],
      cumul: 0,
      vnc: 0,
    }
    setItems([...items, newItem])
  }

  const updateItem = (index: number, field: keyof DepreciationItem, value: any) => {
    const updatedItems = [...items]
    const item = { ...updatedItems[index] }

    item[field] = value

    if (field === 'pa' || field === 'tx' || field === 'annee') {
      const { periods, cumul, vnc } = calculatePeriods(item.pa, item.tx, item.annee)
      item.periods = periods
      item.cumul = cumul
      item.vnc = vnc

      // Update next year items
      const nextYear = [...nextYearItems]
      if (nextYear[index]) {
        nextYear[index] = {
          ...nextYear[index],
          libelle: item.libelle,
          valeur: periods[0],
          frais: (periods[0] * (nextYear[index].quotitePro / 100) * (nextYear[index].pourcentage / 100))
        }
        setNextYearItems(nextYear)
      } else {
        nextYear[index] = {
          libelle: item.libelle,
          valeur: periods[0],
          quotitePro: 60,
          pourcentage: 75,
          frais: (periods[0] * 0.6 * 0.75)
        }
        setNextYearItems(nextYear)
      }
    }

    updatedItems[index] = item
    setItems(updatedItems)
  }

  const updateNextYearItem = (index: number, field: keyof NextYearItem, value: number) => {
    const updatedItems = [...nextYearItems]
    const item = { ...updatedItems[index] }

    item[field] = value

    if (field === 'quotitePro' || field === 'pourcentage') {
      item.frais = (item.valeur * (item.quotitePro / 100) * (item.pourcentage / 100))
    }

    updatedItems[index] = item
    setNextYearItems(updatedItems)
  }

  return (
    <Card className="w-full">
      <CardHeader className="bg-[#1a365d] text-white">
        <CardTitle className="text-center text-3xl">Amortissements {year}</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-8">
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Année</TableHead>
                <TableHead>Libellé</TableHead>
                <TableHead>TX</TableHead>
                <TableHead>P.A.</TableHead>
                {items[0]?.periods && items[0].periods.map((_, index) => (
                  <TableHead key={index}>{index + 1}</TableHead>
                ))}
                <TableHead>Cumul</TableHead>
                <TableHead>V.N.C.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.annee}
                      onChange={(e) => updateItem(index, 'annee', parseInt(e.target.value) || 1)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={item.libelle}
                      onChange={(e) => updateItem(index, 'libelle', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.tx}
                      onChange={(e) => updateItem(index, 'tx', parseFloat(e.target.value) || 0)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.pa}
                      onChange={(e) => updateItem(index, 'pa', parseFloat(e.target.value) || 0)}
                    />
                  </TableCell>
                  {item.periods && item.periods.map((period, periodIndex) => (
                    <TableCell key={periodIndex}>€{period.toFixed(2)}</TableCell>
                  ))}
                  <TableCell>€{item.cumul.toFixed(2)}</TableCell>
                  <TableCell>€{item.vnc.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Button onClick={addItem} className="mt-4">
            Ajouter un amortissement
          </Button>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Amortissement {year + 1}</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Libellé</TableHead>
                <TableHead>Valeur</TableHead>
                <TableHead>Quotité Pro</TableHead>
                <TableHead>Pourcentage</TableHead>
                <TableHead>Frais</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nextYearItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.libelle}</TableCell>
                  <TableCell>€{item.valeur.toFixed(2)}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.quotitePro}
                      onChange={(e) => updateNextYearItem(index, 'quotitePro', parseFloat(e.target.value) || 0)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.pourcentage}
                      onChange={(e) => updateNextYearItem(index, 'pourcentage', parseFloat(e.target.value) || 0)}
                    />
                  </TableCell>
                  <TableCell>€{item.frais.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

