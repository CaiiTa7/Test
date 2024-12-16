
import { NextApiRequest, NextApiResponse } from 'next';
import { serve, setup } from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

// Swagger configuration
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Financial API',
    version: '1.0.0',
    description: 'API for managing financial operations like transactions, summaries, and user profiles.',
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: 'Development server',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./pages/api/**/*.ts'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

// Swagger handler
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return res.status(200).json(swaggerSpec);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
