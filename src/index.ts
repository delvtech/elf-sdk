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

/*
 * This is a handwritten root file used to re-export the public and
 * importable function, interfaces, etc. for consumers of the SDK
 */
export { mintWithUserProxy } from "./mint";
export { getTermExpiration } from "./mint";
export { getTermPosition } from "./mint";
export { SingleSwap } from "./swap";
export { swap } from "./swap";
export { joinConvergentPool } from "./joinPool";
export { joinWeightedPool } from "./joinPool";
export { exitConvergentPool } from "./exitPool";
export { WeightedPoolExitKind } from "./exitPool";
export { exitWeightedPool } from "./exitPool";

export { calcFixedAPR } from "./helpers/calcFixedAPR";
export { calcSwapOutGivenInCCPoolUnsafe } from "./helpers/calcPoolSwap";
export { calcSwapInGivenOutCCPoolUnsafe } from "./helpers/calcPoolSwap";
export { calcSwapOutGivenInWeightedPoolUnsafe } from "./helpers/calcPoolSwap";
export { calcSwapInGivenOutWeightedPoolUnsafe } from "./helpers/calcPoolSwap";
export { calcSpotPricePt } from "./helpers/calcSpotPrice";
export { calcSpotPriceYt } from "./helpers/calcSpotPrice";
export { PoolType } from "./helpers/getElementAddresses";
export { getElementDeploymentAddresses } from "./helpers/getElementAddresses";
export { getElementTermFactoryAddresses } from "./helpers/getElementAddresses";
export { getElementTermAddresses } from "./helpers/getElementAddresses";
export { getElementPtPoolAddresses } from "./helpers/getElementAddresses";
export { getElementYtPoolAddresses } from "./helpers/getElementAddresses";
export { getPoolIdByTermAddress } from "./helpers/getElementAddresses";
export { getBaseTokenAddress } from "./helpers/getElementAddresses";
export { getLatestBlockTimestamp } from "./helpers/getLatestBlockTimestamp";
export { getPoolId } from "./helpers/getPoolId";
export { ReservesResult } from "./helpers/getReserves";
export { getReserves } from "./helpers/getReserves";
export { TermTokenSymbolsResult } from "./helpers/getTermTokenSymbols";
export { getTermByTokenSymbol } from "./helpers/getTermByTokenSymbol";
export { getTerms } from "./helpers/getTerms";
export { getTermTokenSymbols } from "./helpers/getTermTokenSymbols";
export { getSecondsUntilExpiration } from "./helpers/getSecondsUntilExpiration";
export { getTotalSupply } from "./helpers/getTotalSupply";
export { getUnitSeconds } from "./helpers/getUnitSeconds";

export { ONE_MINUTE_IN_SECONDS } from "./constants/time";
export { ONE_HOUR_IN_SECONDS } from "./constants/time";
export { ONE_DAY_IN_SECONDS } from "./constants/time";
export { ONE_WEEK_IN_SECONDS } from "./constants/time";
export { THIRTY_DAYS_IN_SECONDS } from "./constants/time";
export { SIX_MONTHS_IN_SECONDS } from "./constants/time";
export { ONE_YEAR_IN_SECONDS } from "./constants/time";
export { ONE_MINUTE_IN_MILLISECONDS } from "./constants/time";
export { ONE_HOUR_IN_MILLISECONDS } from "./constants/time";
export { ONE_DAY_IN_MILLISECONDS } from "./constants/time";
export { ONE_WEEK_IN_MILLISECONDS } from "./constants/time";
export { ONE_YEAR_IN_MILLISECONDS } from "./constants/time";
export { THIRTY_DAYS_IN_MILLISECONDS } from "./constants/time";
