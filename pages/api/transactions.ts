
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

// Zod schema for validation
const transactionSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['Entrée', 'Sortie']),
  montantHT: z.number().positive(),
  montantTVAC: z.number().positive(),
  tva: z.number().positive(),
  description: z.string().optional(),
});

let transactions = [];

// API for transactions
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json(transactions);
  } else if (req.method === 'POST') {
    const result = transactionSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.errors });
    }
    const transaction = result.data;
    transactions.push(transaction);
    res.status(201).json(transaction);
  } else if (req.method === 'DELETE') {
    const { id } = req.query;
    transactions = transactions.filter((t) => t.id !== id);
    res.status(204).end();
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
