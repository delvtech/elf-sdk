/*
 * Copyright 2021 Element Finance, Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Currency, Money } from "ts-money";
import fetch from "axios";
import { format, subDays } from "date-fns";
import coinsJSON from "./coins.json";

/**
 * Lookup object for getting the CoinGecko coin id from the coin or token's
 * symbol.
 *
 *  Eg:
 *  CoinGeckoIds.eth === 'ethereum' // true
 *
 * This can then be used to make calls to CoinGecko apis about ethereum, ie: price apis.
 *
 * TODO: This can be auto-generated instead of created at runtime.
 */
const CoinGeckoIds: {
  [symbol: string]: string;
} = coinsJSON.reduce(
  (memo, value) => ({ ...memo, [value.symbol]: value.id }),
  {}
);

export function getCoinGeckoId(symbol: string | undefined): string | undefined {
  if (!symbol) {
    return;
  }

  return CoinGeckoIds[symbol.toLowerCase()];
}
export async function fetchCoinGeckoPrice(
  coinGeckoId: string,
  currency: Currency
): Promise<Money> {
  const currencyCode = currency.code.toLowerCase();
  const result = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${coinGeckoId}&vs_currencies=${currencyCode}`
  );

  // Result looks like:
  // { dai: { usd: 1.01 } }
  const resultJSON = result.data;

  const price = resultJSON[coinGeckoId][currencyCode];

  return Money.fromDecimal(
    price,
    currency,
    // Money.fromDecimal will throw if price has more decimals than the currency
    // allows unless you pass a rounding function
    Math.round
  );
}

export async function fetchCoinGeckoHistoricalPrice(
  coinGeckoId: string,
  currency: Currency,
  daysAgo = 1
): Promise<Money> {
  const dateString = format(subDays(new Date(), daysAgo), "dd-MM-yyyy");
  const currencyCode = currency.code.toLowerCase();
  const result = await fetch(
    `https://api.coingecko.com/api/v3/coins/${coinGeckoId}/history?date=${dateString}`
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resultJSON = (await result.data) as any;

  const price = resultJSON["market_data"]["current_price"][currencyCode];

  return Money.fromDecimal(
    price,
    currency,
    // Money.fromDecimal will throw if price has more decimals than the currency
    // allows unless you pass a rounding function
    Math.round
  );
}
