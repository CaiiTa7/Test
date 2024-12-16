
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Table, TableBody, TableCell, TableHead, TableRow } from "./table";
import type { YearlyData } from "../types/calculator";

async function fetchYearlyData(year: number): Promise<YearlyData> {
  const response = await fetch(`/api/summary`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ year }),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch yearly data");
  }
  return await response.json();
}

export function AnnualSummary({ year }: { year: number }) {
  const [yearlyData, setYearlyData] = useState<YearlyData | null>(null);

  useEffect(() => {
    fetchYearlyData(year)
      .then((data) => setYearlyData(data))
      .catch((error) => console.error(error));
  }, [year]);

  if (!yearlyData) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader className="bg-[#1a365d] text-white">
        <CardTitle className="text-center text-3xl">Récapitulatif annuel {year}</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Render yearly data as a table */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Trésorerie</TableCell>
              <TableCell>A verser TVA</TableCell>
              <TableCell>Amortissements</TableCell>
              <TableCell>Revenu Brut</TableCell>
              <TableCell>Cotisations Sociales</TableCell>
              <TableCell>Impôts</TableCell>
              <TableCell>Net</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{yearlyData.tresorerie.toFixed(2)} €</TableCell>
              <TableCell>{yearlyData.aVerserTVA.toFixed(2)} €</TableCell>
              <TableCell>{yearlyData.amortissements.toFixed(2)} €</TableCell>
              <TableCell>{yearlyData.revBrut.toFixed(2)} €</TableCell>
              <TableCell>{yearlyData.cotSoc.toFixed(2)} €</TableCell>
              <TableCell>{yearlyData.impots.toFixed(2)} €</TableCell>
              <TableCell>{yearlyData.net.toFixed(2)} €</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
