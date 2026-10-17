// components/header/offers-bar.tsx
import { serverApi } from '@/lib/server-fetch';
import { OffersBarClient } from './offers-bar-client';

interface OffersBarResponse {
  data: string[];
  success: boolean;
}

async function getOffers(locale:string): Promise<string[]> {
  try {
    const response = await serverApi.get('/api/AppOption/offersBar', {
      locale,
      revalidate: 300, // Cache for 5 minutes
      tags: ['offers-bar'],
    });

    if (response.success && response.data?.data) {
      return response.data.data;
    }
    
    return [];
  } catch (error) {
    console.error('Failed to fetch offers:', error);
    return [];
  }
}

export async function OffersBar({ locale }: { locale: string }) {

  const offers = await getOffers(locale);
  
  if (offers.length === 0) return null;

  return <OffersBarClient offers={offers} />;
}