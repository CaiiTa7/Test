import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table"
import { Input } from "./input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "./button"
import { Transaction } from '@/types/calculator'
import { formatNumber, parseFormattedNumber } from "@/utils/number-formatting"

interface TransactionTableProps {
  transactions: Transaction[];
  onTransactionChange: (index: number, field: keyof Transaction, value: any) => void;
  onAddTransaction: () => void;
}

export function TransactionTable({ transactions, onTransactionChange, onAddTransaction }: TransactionTableProps) {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Désignation</TableHead>
            <TableHead>Entrée/Sortie</TableHead>
            <TableHead>Montant (TVAC)</TableHead>
            <TableHead>Taux TVA (%)</TableHead>
            <TableHead>Frais (%)</TableHead>
            <TableHead>Montant HT</TableHead>
            <TableHead>TVA</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction, index) => (
            <TableRow key={index}>
              <TableCell>
                <Input
                  type="date"
                  value={transaction.date}
                  onChange={(e) => onTransactionChange(index, 'date', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <Input
                  value={transaction.designation}
                  onChange={(e) => onTransactionChange(index, 'designation', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <Select
                  value={transaction.type}
                  onValueChange={(value) => onTransactionChange(index, 'type', value as 'Entrée' | 'Sortie')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entrée">Entrée</SelectItem>
                    <SelectItem value="Sortie">Sortie</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={transaction.montantTVAC === 0 ? '' : transaction.montantTVAC}
                  onChange={(e) => {
                    const newValue = e.target.value === '' ? 0 : parseFloat(e.target.value);
                    onTransactionChange(index, 'montantTVAC', newValue);
                  }}
                  onFocus={(e) => {
                    e.target.value = parseFormattedNumber(e.target.value).toString(); // Clear formatted value on focus
                    e.target.select();
                  }}
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={transaction.tauxTVA === 0 ? '' : transaction.tauxTVA}
                  onChange={(e) => {
                    const newValue = e.target.value === '' ? 0 : parseFloat(e.target.value);
                    onTransactionChange(index, 'tauxTVA', newValue);
                  }}
                  onFocus={(e) => {
                    e.target.value = parseFormattedNumber(e.target.value).toString(); // Clear formatted value on focus
                    e.target.select();
                  }}
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={transaction.frais === 0 ? '' : transaction.frais}
                  onChange={(e) => {
                    const newValue = e.target.value === '' ? 0 : parseFloat(e.target.value);
                    onTransactionChange(index, 'frais', newValue);
                  }}
                  onFocus={(e) => {
                    e.target.value = parseFormattedNumber(e.target.value).toString(); // Clear formatted value on focus
                    e.target.select();
                  }}
                />
              </TableCell>
              <TableCell>€{transaction.montantHT.toFixed(2)}</TableCell>
              <TableCell>€{transaction.tva.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button onClick={onAddTransaction} className="mt-4">
        Ajouter une transaction
      </Button>
    </>
  )
}

