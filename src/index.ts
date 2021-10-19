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
export { mintWithUserProxy } from "src/mint";
export { getTermExpiration } from "src/mint";
export { getTermPosition } from "src/mint";
export { SingleSwap } from "src/swap";
export { swap } from "src/swap";
export { joinConvergentPool } from "src/joinPool";
export { joinWeightedPool } from "src/joinPool";
export { exitConvergentPool } from "src/exitPool";
export { WeightedPoolExitKind } from "src/exitPool";
export { exitWeightedPool } from "src/exitPool";

export { calcFixedAPR } from "src/helpers/calcFixedAPR";
export { calcSwapOutGivenInCCPoolUnsafe } from "src/helpers/calcPoolSwap";
export { calcSwapInGivenOutCCPoolUnsafe } from "src/helpers/calcPoolSwap";
export { calcSwapOutGivenInWeightedPoolUnsafe } from "src/helpers/calcPoolSwap";
export { calcSwapInGivenOutWeightedPoolUnsafe } from "src/helpers/calcPoolSwap";
export { calcSpotPricePt } from "src/helpers/calcSpotPrice";
export { calcSpotPriceYt } from "src/helpers/calcSpotPrice";
export { PoolType } from "src/helpers/getElementAddresses";
export { getElementDeploymentAddresses } from "src/helpers/getElementAddresses";
export { getElementTermFactoryAddresses } from "src/helpers/getElementAddresses";
export { getElementTermAddresses } from "src/helpers/getElementAddresses";
export { getElementPtPoolAddresses } from "src/helpers/getElementAddresses";
export { getElementYtPoolAddresses } from "src/helpers/getElementAddresses";
export { getPoolIdByTermAddress } from "src/helpers/getElementAddresses";
export { getBaseTokenAddress } from "src/helpers/getElementAddresses";
export { getLatestBlockTimestamp } from "src/helpers/getLatestBlockTimestamp";
export { getPoolId } from "src/helpers/getPoolId";
export { ReservesResult } from "src/helpers/getReserves";
export { getReserves } from "src/helpers/getReserves";
export { TermTokenSymbolsResult } from "src/helpers/getTermTokenSymbols";
export { getTermByTokenSymbol } from "src/helpers/getTermByTokenSymbol";
export { getTerms } from "src/helpers/getTerms";
export { getTermTokenSymbols } from "src/helpers/getTermTokenSymbols";
export { getTimeUntilExpiration } from "src/helpers/getTimeUntilExpiration";
export { getTotalSupply } from "src/helpers/getTotalSupply";
export { getUnitSeconds } from "src/helpers/getUnitSeconds";

export { ONE_MINUTE_IN_SECONDS } from "src/constants/time";
export { ONE_HOUR_IN_SECONDS } from "src/constants/time";
export { ONE_DAY_IN_SECONDS } from "src/constants/time";
export { ONE_WEEK_IN_SECONDS } from "src/constants/time";
export { THIRTY_DAYS_IN_SECONDS } from "src/constants/time";
export { SIX_MONTHS_IN_SECONDS } from "src/constants/time";
export { ONE_YEAR_IN_SECONDS } from "src/constants/time";
export { ONE_MINUTE_IN_MILLISECONDS } from "src/constants/time";
export { ONE_HOUR_IN_MILLISECONDS } from "src/constants/time";
export { ONE_DAY_IN_MILLISECONDS } from "src/constants/time";
export { ONE_WEEK_IN_MILLISECONDS } from "src/constants/time";
export { ONE_YEAR_IN_MILLISECONDS } from "src/constants/time";
export { THIRTY_DAYS_IN_MILLISECONDS } from "src/constants/time";
