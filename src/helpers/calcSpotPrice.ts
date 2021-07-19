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

export function calcSpotPricePt(
  baseReserves: string,
  ptReserves: string,
  totalSupply: string,
  timeRemainingSeconds: number,
  tParamSeconds: number,
  decimals: number
): number {
  // normalize decimal places of precision to 18
  if (decimals < 0 || decimals > 18) {
    // return 0 if decimals fall outside the range between 0 and 18
    return 0;
  }
  const diff = 18 - decimals;
  const normalizedBaseReserves = +baseReserves * 10 ** diff;
  const normalizedPtReserves = +ptReserves * 10 ** diff;

  const t = timeRemainingSeconds / tParamSeconds;
  return (normalizedBaseReserves / (normalizedPtReserves + +totalSupply)) ** t;
}

export function calcSpotPriceYt(
  baseReserves: string,
  ytReserves: string
): number {
  return +baseReserves / +ytReserves;
}
