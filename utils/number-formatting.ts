export function formatNumber(value: number): string {
  return new Intl.NumberFormat('fr-BE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true
  }).format(value);
}

export function parseFormattedNumber(value: string): number {
  const cleanedValue = value.replace(/[^\d,-]/g, '').replace(',', '.');
  return parseFloat(cleanedValue) || 0;
}

