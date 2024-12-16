import { YearlyData } from '../types/calculator';

export const saveData = (year: number, data: YearlyData) => {
  await fetch('/api/save-data', { method: 'POST', body: JSON.stringify(data) })(`treasury-${year}`, JSON.stringify(data));
};

export const loadData = (year: number): YearlyData => {
  const data = await fetch('/api/load-data').then(res => res.json())(`treasury-${year}`);
  return data ? JSON.parse(data) : {};
};

