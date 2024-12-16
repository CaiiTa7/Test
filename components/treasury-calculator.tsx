"use client"

import { useState, useEffect, useCallback } from "react"
import { PersonalInfo } from "./personal-info"
import { MonthlyView } from "./monthly-view"
import { AnnualSummary } from "./annual-summary"
import { Depreciation as Amortissements } from "./depreciation" // Renamed import
import { FiscalOptimizations } from "./fiscal-optimizations"
import { MonthlyData, YearlyData, UserInfo } from "@/types/calculator"
import { saveData, loadData } from "@/utils/storage"
import { calculateTotals } from "@/utils/calculations"

interface TreasuryCalculatorProps {
  month: string;
  year: number;
}

export function TreasuryCalculator({ month, year }: TreasuryCalculatorProps) {
  const [yearlyData, setYearlyData] = useState<YearlyData>(() => {
    const loadedData = loadData(year);
    Object.keys(loadedData).forEach(month => {
      if (!loadedData[month].totals) {
        loadedData[month].totals = calculateTotals(loadedData[month].transactions, loadedData[month].userInfo);
      }
    });
    return loadedData;
  });
  const [activeTab, setActiveTab] = useState("personnel"); // Changed default tab
  const [userInfo, setUserInfo] = useState<UserInfo>({
    statutIndependant: 'Principal',
    anneeDebutActivite: year,
    situationFamiliale: 'Isolé',
    personnesACharge: 0,
    revenuConjoint: 0,
    autresRevenus: 0,
    fraisProfessionnels: 'Forfaitaires',
    fraisProfessionnelsReels: 0,
  });

  const handleDataChange = useCallback((monthData: MonthlyData) => {
    setYearlyData(prevData => {
      const newData = {
        ...prevData,
        [month]: {
          ...monthData,
          totals: calculateTotals(monthData.transactions, monthData.userInfo)
        }
      };
      saveData(year, newData);
      return newData;
    });
  }, [month, year]);

  const handleUserInfoChange = useCallback((newUserInfo: UserInfo) => {
    setUserInfo(newUserInfo);
    setYearlyData(prevData => {
      const newData = { ...prevData };
      Object.keys(newData).forEach(month => {
        newData[month] = {
          ...newData[month],
          userInfo: newUserInfo,
          totals: calculateTotals(newData[month].transactions, newUserInfo)
        };
      });
      saveData(year, newData);
      return newData;
    });
  }, [year]);

  const currentMonthData = yearlyData[month] || {
    transactions: [],
    balances: { comptePro: 0, compteEpargne: 0, comptePrive: 0 },
    userInfo: userInfo,
    totals: { tva: 0, cotisationsSoc: 0, impots: 0, aEpargner: 0 },
  };

  const revenuBrutAnnuel = Object.values(yearlyData).reduce((sum, monthData) => 
    sum + monthData.transactions.reduce((monthSum, t) => 
      monthSum + (t.type === 'Entrée' ? t.montantHT : 0), 0
    ), 0
  );

  return (
    <div className="w-full p-6 bg-white shadow-md rounded-lg">
      <div className="mb-4">
        <nav className="flex space-x-4">
          {["personnel", "mensuel", "annuel", "amortissements", "optimisations"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2 rounded-md ${
                activeTab === tab
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === "personnel" && (
        <PersonalInfo
          initialUserInfo={userInfo}
          onUserInfoChange={handleUserInfoChange}
        />
      )}

      {activeTab === "mensuel" && (
        <MonthlyView
          month={month}
          year={year}
          data={currentMonthData}
          onDataChange={handleDataChange}
          onUserInfoChange={handleUserInfoChange}
        />
      )}

      {activeTab === "annuel" && (
        <AnnualSummary year={year} yearlyData={yearlyData} />
      )}

      {activeTab === "amortissements" && (
        <Amortissements year={year} />
      )}

      {activeTab === "optimisations" && (
        <FiscalOptimizations
          userInfo={userInfo}
          revenuBrut={revenuBrutAnnuel}
        />
      )}
    </div>
  );
}

