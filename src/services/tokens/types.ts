export interface ITicker {
  data: Array<{
    id: string;
    symbol: string;
    name: string;
    nameid: string;
    rank: number;
    price_usd: string;
    percent_change_24h: string;
    percent_change_1h: string;
    percent_change_7d: string;
    price_btc: string;
    market_cap_usd: string;
    volume24: number;
    volume24a: number;
    csupply: string;
    tsupply?: string;
    msupply?: string;
  }>;
  info: {
    coins_num: number;
    time: number;
  };
}

export interface ICoinStatsTicker {
  result: Array<{
    id: string;
    icon: string;
    name: string;
    symbol: string;
    rank: number;
    price: number;
    priceBtc: number;
    volume: number;
    marketCap: number;
    availableSupply: number;
    totalSupply: number;
    fullyDilutedValuation: number;
    priceChange1h: number;
    priceChange1d: number;
    priceChange1w: number;
    redditUrl: string;
    twitterUrl: string;
    contractAddresses: any[];
    explorers: string[];
  }>;
}
