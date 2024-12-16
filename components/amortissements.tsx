"use client"

import { useState, useEffect } from "react"
import { z } from 'zod';
import { Input } from "./input"
import { Button } from "./button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table"
import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { formatNumber, parseFormattedNumber } from "@/utils/number-formatting"

const amortissementSchema = z.object({
  annee: z.number().int().positive(),
  libelle: z.string().min(1, "Le libellé est requis"),
  tx: z.number().min(0).max(100),
  pa: z.number().nonnegative(),
  periods: z.array(z.number()),
  cumul: z.number(),
  vnc: z.number(),
});

type Amortissement = z.infer<typeof amortissementSchema>;

interface AmortissementsProps {
  year: number;
}

export function Amortissements({ year }: AmortissementsProps) {
  const [amortissements, setAmortissements] = useState<Amortissement[]>(() => {
    const savedData = await fetch('/api/endpoint').then(res => res.json())(`amortissements-${year}`);
    return savedData ? JSON.parse(savedData) : [];
  });

  useEffect(() => {
    await fetch('/api/endpoint', { method: 'POST', body: JSON.stringify(data) })(`amortissements-${year}`, JSON.stringify(amortissements));
  }, [amortissements, year]);

  const calculatePeriods = (pa: number, tx: number, annee: number) => {
    const periodAmount = pa * (tx / 100) / annee;
    const periods = Array(annee).fill(periodAmount);
    const cumul = pa;
    const vnc = 0;
    return { periods, cumul, vnc };
  };

  const addAmortissement = () => {
    const newAmortissement: Amortissement = {
      annee: 1,
      libelle: "",
      tx: 33,
      pa: 0,
      periods: [],
      cumul: 0,
      vnc: 0,
    };
    setAmortissements([...amortissements, newAmortissement]);
  };

  const updateAmortissement = (index: number, field: keyof Amortissement, value: any) => {
    const updatedAmortissements = [...amortissements];
    const item = { ...updatedAmortissements[index], [field]: value };

    if (field === 'pa' || field === 'tx' || field === 'annee') {
      const { periods, cumul, vnc } = calculatePeriods(item.pa, item.tx, item.annee);
      item.periods = periods;
      item.cumul = cumul;
      item.vnc = vnc;
    }

    updatedAmortissements[index] = item;
    setAmortissements(updatedAmortissements);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Amortissements {year}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Année</TableHead>
                <TableHead>Libellé</TableHead>
                <TableHead>TX</TableHead>
                <TableHead>P.A.</TableHead>
                <TableHead>Amortissement</TableHead>
                <TableHead>Cumul</TableHead>
                <TableHead>V.N.C.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {amortissements.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.annee}
                      onChange={(e) => updateAmortissement(index, 'annee', parseInt(e.target.value) || 1)}
                      min="1"
                      className="w-full"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="text"
                      value={item.libelle}
                      onChange={(e) => updateAmortissement(index, 'libelle', e.target.value)}
                      className="w-full"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.tx}
                      onChange={(e) => updateAmortissement(index, 'tx', parseFloat(e.target.value) || 0)}
                      min="0"
                      max="100"
                      step="0.01"
                      className="w-full"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="text"
                      value={formatNumber(item.pa)}
                      onChange={(e) => updateAmortissement(index, 'pa', parseFormattedNumber(e.target.value))}
                      className="w-full"
                    />
                  </TableCell>
                  <TableCell>
                    {formatNumber(item.periods[0] || 0)} €
                  </TableCell>
                  <TableCell>
                    {formatNumber(item.cumul)} €
                  </TableCell>
                  <TableCell>
                    {formatNumber(item.vnc)} €
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Button
          onClick={addAmortissement}
          className="mt-4"
        >
          Ajouter un amortissement
        </Button>
      </CardContent>
    </Card>
  );
}

