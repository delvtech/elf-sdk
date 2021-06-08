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

export function calcSwapOutGivenInCCPoolUnsafe(
  xAmount: string,
  xReserves: string,
  yReserves: string,
  totalSupply: string,
  timeRemainingSeconds: number,
  tParamSeconds: number,
  baseAssetIn: boolean
): number {
  const tS = +totalSupply;
  const amountX = +xAmount;

  let xR = +xReserves + tS;
  let yR = +yReserves;

  if (baseAssetIn) {
    xR = +xReserves;
    yR = +yReserves + tS;
  }

  const t = timeRemainingSeconds / tParamSeconds;

  const xBefore = xR ** (1 - t);
  const yBefore = yR ** (1 - t);

  const xAfter = (xR + amountX) ** (1 - t);

  // this is the real equation, make ascii art for it
  const yAfter = (xBefore + yBefore - xAfter) ** (1 / (1 - t));

  const amountY = yR - yAfter;

  return amountY;
}

export function calcSwapInGivenOutCCPoolUnsafe(
  xAmount: string,
  xReserves: string,
  yReserves: string,
  totalSupply: string,
  timeRemainingSeconds: number,
  tParamSeconds: number,
  baseAssetIn: boolean
): number {
  const tS = +totalSupply;
  const amountX = +xAmount;

  let xR = +xReserves + tS;
  let yR = +yReserves;

  if (baseAssetIn) {
    xR = +xReserves;
    yR = +yReserves + tS;
  }

  const t = timeRemainingSeconds / tParamSeconds;

  const xBefore = xR ** (1 - t);
  const yBefore = yR ** (1 - t);

  const xAfter = (xR - amountX) ** (1 - t);

  // this is the real equation, make ascii art for it
  const yAfter = (xBefore + yBefore - xAfter) ** (1 / (1 - t));

  const amountY = yAfter - yR;

  return amountY;
}

// Computes how many tokens can be taken out of a pool if `amountIn` are sent, given the current
// balances and weights.  In our case the weights are the same so we don't need to add them to our
// calcs
/**********************************************************************************************
// outGivenIn                                                                                //
// aO = amountOut                                                                            //
// bO = balanceOut                                                                           //
// bI = balanceIn              /      /            bI             \    (wI / wO) \           //
// aI = amountIn    aO = bO * |  1 - | --------------------------  | ^            |          //
// wI = weightIn               \      \       ( bI + aI )         /              /           //
// wO = weightOut                                                                            //
**********************************************************************************************/
export function calcSwapOutGivenInWeightedPoolUnsafe(
  amountIn: string,
  balanceOut: string,
  balanceIn: string
): number {
  const aI = +amountIn;
  const bO = +balanceOut;
  const bI = +balanceIn;

  const amountOut = bO * (1 - bI / (bI + aI));

  return amountOut;
}

// Computes how many tokens must be sent to a pool in order to take `amountOut`, given the current
// balances and weights.  In our case the weights are the same so we don't need to add them to our
// calcs.
/**********************************************************************************************
// inGivenOut                                                                                //
// aO = amountOut                                                                            //
// bO = balanceOut                                                                           //
// bI = balanceIn              /  /            bO             \    (wO / wI)      \          //
// aI = amountIn    aI = bI * |  | --------------------------  | ^            - 1  |         //
// wI = weightIn               \  \       ( bO - aO )         /                   /          //
// wO = weightOut                                                                            //
**********************************************************************************************/
export function calcSwapInGivenOutWeightedPoolUnsafe(
  amountOut: string,
  balanceOut: string,
  balanceIn: string
): number {
  const aO = +amountOut;
  const bO = +balanceOut;
  const bI = +balanceIn;

  const amountIn = bI * (bO / (bO - aO) - 1);

  return amountIn;
}
