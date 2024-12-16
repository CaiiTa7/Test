"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { Table, TableBody, TableCell, TableRow } from "./table"
import { Input } from "./input"
import { UserInfoForm } from "./user-info-form"
import { TransactionTable } from "./transaction-table"
import { MonthlyData, Transaction, UserInfo } from "@/types/calculator"
import { calculateTotals } from "@/utils/calculations"
import { formatNumber, parseFormattedNumber } from "@/utils/number-formatting"

interface MonthlyViewProps {
  month: string;
  year: number;
  data: MonthlyData;
  onDataChange: (data: MonthlyData) => void;
  onUserInfoChange: (userInfo: UserInfo) => void;
}

export function MonthlyView({ month, year, data, onDataChange, onUserInfoChange }: MonthlyViewProps) {
  const [localData, setLocalData] = useState<MonthlyData>(data);

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  useEffect(() => {
    const newTotals = calculateTotals(localData.transactions, localData.userInfo);
    if (JSON.stringify(newTotals) !== JSON.stringify(localData.totals)) {
      setLocalData(prev => ({ ...prev, totals: newTotals }));
      onDataChange({ ...localData, totals: newTotals });
    }
  }, [localData.transactions, localData.userInfo, onDataChange]);

  const updateBalance = useCallback((field: keyof MonthlyData['balances'], value: string) => {
    const numericValue = parseFormattedNumber(value);
    setLocalData(prev => ({
      ...prev,
      balances: {
        ...prev.balances,
        [field]: numericValue,
      },
    }));
  }, []);

  const updateUserInfo = useCallback((field: keyof UserInfo, value: any) => {
    setLocalData(prev => {
      const newUserInfo = { ...prev.userInfo, [field]: value };
      onUserInfoChange(newUserInfo);
      return { ...prev, userInfo: newUserInfo };
    });
  }, [onUserInfoChange]);

  const updateTransaction = useCallback((index: number, field: keyof Transaction, value: any) => {
    setLocalData(prev => {
      const updatedTransactions = [...prev.transactions];
      const transaction = { ...updatedTransactions[index], [field]: value };

      if (field === 'montantTVAC' || field === 'tauxTVA') {
        const montantHT = transaction.montantTVAC / (1 + transaction.tauxTVA / 100);
        const tva = transaction.montantTVAC - montantHT;
        transaction.montantHT = montantHT;
        transaction.tva = tva;
      }

      updatedTransactions[index] = transaction;

      return {
        ...prev,
        transactions: updatedTransactions,
      };
    });
  }, []);

  const addTransaction = useCallback(() => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      designation: "",
      type: "Entrée",
      montantTVAC: 0,
      tauxTVA: 21,
      frais: 0,
      montantHT: 0,
      tva: 0,
    };
    setLocalData(prev => ({
      ...prev,
      transactions: [...prev.transactions, newTransaction],
    }));
  }, []);

  return (
    <Card className="w-full">
      <CardHeader className="bg-[#1a365d] text-white">
        <CardTitle className="text-center text-3xl">
          {month} {year}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Compte Pro</TableCell>
                  <TableCell>
                    <Input
                      type="text"
                      value={formatNumber(localData.balances.comptePro)}
                      onChange={(e) => updateBalance('comptePro', e.target.value)}
                      onFocus={(e) => {
                        e.target.value = parseFormattedNumber(e.target.value).toString(); // Clear formatted value on focus
                        e.target.select();
                      }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Compte épargne</TableCell>
                  <TableCell>
                    <Input
                      type="text"
                      value={formatNumber(localData.balances.compteEpargne)}
                      onChange={(e) => updateBalance('compteEpargne', e.target.value)}
                      onFocus={(e) => {
                        e.target.value = parseFormattedNumber(e.target.value).toString(); // Clear formatted value on focus
                        e.target.select();
                      }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Compte Privé</TableCell>
                  <TableCell>
                    <Input
                      type="text"
                      value={formatNumber(localData.balances.comptePrive)}
                      onChange={(e) => updateBalance('comptePrive', e.target.value)}
                      onFocus={(e) => {
                        e.target.value = parseFormattedNumber(e.target.value).toString(); // Clear formatted value on focus
                        e.target.select();
                      }}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>TVA</TableCell>
                  <TableCell>{formatNumber(localData.totals.tva)} €</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Cotisations Soc.</TableCell>
                  <TableCell>{formatNumber(localData.totals.cotisationsSoc)} €</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Impôts</TableCell>
                  <TableCell>{formatNumber(localData.totals.impots)} €</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>À épargner</TableCell>
                  <TableCell>{formatNumber(localData.totals.aEpargner)} €</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Informations personnelles</h3>
          <UserInfoForm userInfo={localData.userInfo} onUserInfoChange={updateUserInfo} />
        </div>

        <TransactionTable
          transactions={localData.transactions}
          onTransactionChange={updateTransaction}
          onAddTransaction={addTransaction}
        />
      </CardContent>
    </Card>
  );
}

