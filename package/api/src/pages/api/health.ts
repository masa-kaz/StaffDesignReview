import 'reflect-metadata';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    return res.status(200).json({
      message: 'Staff Design Review API is running',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      graphqlEndpoint: '/api/graphql',
      architecture: 'Clean Architecture + GraphQL'
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
