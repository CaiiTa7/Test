
import { NextApiRequest, NextApiResponse } from 'next';

let data = {};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    data = { ...req.body };
    res.status(200).json({ message: 'Data saved' });
  } else if (req.method === 'GET') {
    res.status(200).json(data);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
