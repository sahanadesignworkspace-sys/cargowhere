import type { Request, Response } from 'express';

export interface LTACarparkItem {
  CarParkID: string;
  Area: string;
  Development: string;
  Location: string; // e.g. "1.2838 103.8591" (Lat Lng separated by space)
  AvailableLots: number;
  LotType: string; // "C" (Cars), "H" (Heavy), "Y" (Motorcycles)
  Agency: string; // "HDB", "LTA", "URA"
}

export interface LTAResponse {
  'odata.metadata'?: string;
  value: LTACarparkItem[];
}

const LTA_CARPARK_API_URL = 'https://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2';

/**
 * Serverless function to pull live carpark availability from LTA DataMall
 * Endpoint: /api/carparkavailability
 */
export default async function handler(req: Request, res: Response) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, AccountKey, x-account-key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Retrieve AccountKey from environment variable or optional request header
  const accountKey =
    process.env.LTA_ACCOUNT_KEY ||
    (req.headers['accountkey'] as string) ||
    (req.headers['x-account-key'] as string);

  if (!accountKey || accountKey === 'YOUR_LTA_ACCOUNT_KEY') {
    return res.status(503).json({
      error: 'LTA_ACCOUNT_KEY not configured',
      message: 'The LTA DataMall AccountKey has not been set yet. Please configure LTA_ACCOUNT_KEY in your environment variables.',
      endpoint: LTA_CARPARK_API_URL,
      help: 'Request a free key at https://datamall.lta.gov.sg/content/datamall/en/request-for-api.html',
    });
  }

  const skip = req.query['$skip'] || req.query['skip'];
  const fetchAll = req.query['fetchAll'] === 'true' || req.query['all'] === 'true';

  try {
    if (fetchAll) {
      // Automatically fetch all pages (LTA DataMall returns up to 500 items per call)
      let allLots: LTACarparkItem[] = [];
      let currentSkip = 0;
      let hasMore = true;
      let iterations = 0;
      const MAX_PAGES = 10; // safety ceiling

      while (hasMore && iterations < MAX_PAGES) {
        iterations++;
        const targetUrl = `${LTA_CARPARK_API_URL}?$skip=${currentSkip}`;

        const ltaRes = await fetch(targetUrl, {
          method: 'GET',
          headers: {
            AccountKey: accountKey,
            Accept: 'application/json',
          },
        });

        if (!ltaRes.ok) {
          const errorText = await ltaRes.text();
          return res.status(ltaRes.status).json({
            error: `LTA DataMall API error (Status ${ltaRes.status})`,
            details: errorText,
          });
        }

        const data: LTAResponse = await ltaRes.json();
        const batch = data.value || [];
        allLots = allLots.concat(batch);

        if (batch.length < 500) {
          hasMore = false;
        } else {
          currentSkip += 500;
        }
      }

      res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60');
      return res.status(200).json({
        total: allLots.length,
        timestamp: new Date().toISOString(),
        value: allLots,
      });
    }

    // Single page fetch
    const targetUrl = skip ? `${LTA_CARPARK_API_URL}?$skip=${skip}` : LTA_CARPARK_API_URL;

    const ltaResponse = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        AccountKey: accountKey,
        Accept: 'application/json',
      },
    });

    if (!ltaResponse.ok) {
      const errorText = await ltaResponse.text();
      return res.status(ltaResponse.status).json({
        error: `LTA DataMall API responded with HTTP ${ltaResponse.status}`,
        details: errorText,
      });
    }

    const data: LTAResponse = await ltaResponse.json();

    // Cache response for 1 minute as LTA DataMall carpark availability refreshes every 1 min
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60');
    return res.status(200).json({
      timestamp: new Date().toISOString(),
      count: data.value ? data.value.length : 0,
      ...data,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: 'Failed to communicate with LTA DataMall API',
      message: error?.message || 'Unknown network error',
    });
  }
}
