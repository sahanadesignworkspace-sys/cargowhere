import type { Request, Response } from 'express';

export interface HealthResponse {
  status: 'ok' | 'degraded' | 'error';
  service: string;
  timestamp: string;
  ltaAccountKeyConfigured: boolean;
  version: string;
}

/**
 * Serverless healthcheck handler
 * Compatible with Express, Vercel, and Cloud Functions
 */
export default async function handler(req: Request, res: Response) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, AccountKey');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const isKeyConfigured = Boolean(process.env.LTA_ACCOUNT_KEY && process.env.LTA_ACCOUNT_KEY !== 'YOUR_LTA_ACCOUNT_KEY');

  const healthData: HealthResponse = {
    status: 'ok',
    service: 'ParkSG LTA Carpark Availability API',
    timestamp: new Date().toISOString(),
    ltaAccountKeyConfigured: isKeyConfigured,
    version: '1.0.0',
  };

  return res.status(200).json(healthData);
}
