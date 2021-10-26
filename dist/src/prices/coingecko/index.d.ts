import { Currency, Money } from "ts-money";
export declare function getCoinGeckoId(
  symbol: string | undefined
): string | undefined;
export declare function fetchCoinGeckoPrice(
  coinGeckoId: string,
  currency: Currency
): Promise<Money>;
export declare function fetchCoinGeckoHistoricalPrice(
  coinGeckoId: string,
  currency: Currency,
  daysAgo?: number
): Promise<Money>;
