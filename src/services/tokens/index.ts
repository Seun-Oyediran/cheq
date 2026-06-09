import { useQuery } from '@tanstack/react-query';
import { api } from '../api';
import type { ICoinStatsTicker, ITicker } from './types';

export type { ICoinStatsTicker, ITicker } from './types';

export const useFetchTickers = () => {
  const hash = ['tickers'];
  const response = useQuery({
    queryKey: hash,
    queryFn: async () => {
      return await api.get({ url: 'https://api.coinlore.net/api/tickers/' });
    },
  });
  return response.data as ITicker | undefined;
};

interface ICoinstatsParams {
  limit?: number;
  page?: number;
  sortBy?:
    | 'rank'
    | 'marketCap'
    | 'price'
    | 'volume'
    | 'priceChange1h'
    | 'priceChange1d'
    | 'priceChange7d'
    | 'name'
    | 'symbol';
  sortDir?: 'asc' | 'desc';
  currency?: string;
}

export const useFetchCoinstats = (params?: ICoinstatsParams) => {
  const { limit = 200, page = 1, sortBy, sortDir = 'desc', currency = 'USD' } = params || {};

  // Build query string
  const queryParams = new URLSearchParams({
    limit: limit.toString(),
    page: page.toString(),
    currency,
  });

  if (sortBy) {
    queryParams.append('sortBy', sortBy);
    queryParams.append('sortDir', sortDir);
  }

  const hash = ['coinstats-tickers', sortBy, sortDir, limit, page];
  const response = useQuery({
    queryKey: hash,
    queryFn: async () => {
      return await api.get({
        url: `https://openapiv1.coinstats.app/coins?${queryParams.toString()}`,
        headers: {
          'X-API-KEY': process.env.NEXT_PUBLIC_COINSTATS_API_KEY || '',
        },
      });
    },
  });
  return response.data?.data as ICoinStatsTicker | undefined;
};
