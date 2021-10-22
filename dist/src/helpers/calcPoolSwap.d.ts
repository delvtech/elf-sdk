export declare function calcSwapOutGivenInCCPoolUnsafe(
  xAmount: string,
  xReserves: string,
  yReserves: string,
  totalSupply: string,
  timeRemainingSeconds: number,
  tParamSeconds: number,
  baseAssetIn: boolean
): number;
export declare function calcSwapInGivenOutCCPoolUnsafe(
  xAmount: string,
  xReserves: string,
  yReserves: string,
  totalSupply: string,
  timeRemainingSeconds: number,
  tParamSeconds: number,
  baseAssetIn: boolean
): number;
/**********************************************************************************************
// outGivenIn                                                                                //
// aO = amountOut                                                                            //
// bO = balanceOut                                                                           //
// bI = balanceIn              /      /            bI             \    (wI / wO) \           //
// aI = amountIn    aO = bO * |  1 - | --------------------------  | ^            |          //
// wI = weightIn               \      \       ( bI + aI )         /              /           //
// wO = weightOut                                                                            //
**********************************************************************************************/
export declare function calcSwapOutGivenInWeightedPoolUnsafe(
  amountIn: string,
  balanceOut: string,
  balanceIn: string
): number;
/**********************************************************************************************
// inGivenOut                                                                                //
// aO = amountOut                                                                            //
// bO = balanceOut                                                                           //
// bI = balanceIn              /  /            bO             \    (wO / wI)      \          //
// aI = amountIn    aI = bI * |  | --------------------------  | ^            - 1  |         //
// wI = weightIn               \  \       ( bO - aO )         /                   /          //
// wO = weightOut                                                                            //
**********************************************************************************************/
export declare function calcSwapInGivenOutWeightedPoolUnsafe(
  amountOut: string,
  balanceOut: string,
  balanceIn: string
): number;
