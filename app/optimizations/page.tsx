"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Optimization {
  description: string
  maxDeduction: number | string
  taxReduction?: number
  minAmount?: number
}

export default function OptimizationsPage() {
  const [optimizations, setOptimizations] = useState<Record<string, Optimization> | null>(null)

  useEffect(() => {
    fetch('/api/optimizations')
      .then(res => res.json())
      .then(data => setOptimizations(data))
  }, [])

  if (!optimizations) return <div>Loading...</div>

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Optimisations Fiscales</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Optimisation</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Déduction Maximale</TableHead>
                <TableHead>Autres Informations</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(optimizations).map(([key, optimization]) => (
                <TableRow key={key}>
                  <TableCell>{key}</TableCell>
                  <TableCell>{optimization.description}</TableTableCell>{optimization.description}</TableCell>
                  <TableCell>{typeof optimization.maxDeduction === 'number' ? `€${optimization.maxDeduction}` : optimization.maxDeduction}</TableCell>
                  <TableCell>
                    {optimization.taxReduction && `Réduction d'impôt: ${optimization.taxReduction * 100}%`}
                    {optimization.minAmount && `Montant minimum: €${optimization.minAmount}`}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

