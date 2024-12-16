
import { NextApiRequest, NextApiResponse } from 'next';
import { calculateTotals } from '@/utils/calculations';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { transactions, userInfo } = req.body;

        if (!transactions || !userInfo) {
            return res.status(400).json({ error: 'Invalid input' });
        }

        const totals = calculateTotals(transactions, userInfo);
        return res.status(200).json({ totals });
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
