"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.THIRTY_DAYS_IN_MILLISECONDS = exports.ONE_YEAR_IN_MILLISECONDS = exports.ONE_WEEK_IN_MILLISECONDS = exports.ONE_DAY_IN_MILLISECONDS = exports.ONE_HOUR_IN_MILLISECONDS = exports.ONE_MINUTE_IN_MILLISECONDS = exports.ONE_YEAR_IN_SECONDS = exports.SIX_MONTHS_IN_SECONDS = exports.THIRTY_DAYS_IN_SECONDS = exports.ONE_WEEK_IN_SECONDS = exports.ONE_DAY_IN_SECONDS = exports.ONE_HOUR_IN_SECONDS = exports.ONE_MINUTE_IN_SECONDS = exports.getUnitSeconds = exports.getTotalSupply = exports.getTimeUntilExpiration = exports.getTermTokenSymbols = exports.getTerms = exports.getTermByTokenSymbol = exports.TermTokenSymbolsResult = exports.getReserves = exports.getPoolId = exports.getLatestBlockTimestamp = exports.getBaseTokenAddress = exports.getPoolIdByTermAddress = exports.getElementYtPoolAddresses = exports.getElementPtPoolAddresses = exports.getElementTermAddresses = exports.getElementTermFactoryAddresses = exports.getElementDeploymentAddresses = exports.PoolType = exports.calcSpotPriceYt = exports.calcSpotPricePt = exports.calcSwapInGivenOutWeightedPoolUnsafe = exports.calcSwapOutGivenInWeightedPoolUnsafe = exports.calcSwapInGivenOutCCPoolUnsafe = exports.calcSwapOutGivenInCCPoolUnsafe = exports.calcFixedAPR = exports.exitWeightedPool = exports.WeightedPoolExitKind = exports.exitConvergentPool = exports.joinWeightedPool = exports.joinConvergentPool = exports.swap = exports.getTermPosition = exports.getTermExpiration = exports.mintWithUserProxy = void 0;
/*
 * This is a handwritten root file used to re-export the public and
 * importable function, interfaces, etc. for consumers of the SDK
 */
var mint_1 = require("./mint");
Object.defineProperty(exports, "mintWithUserProxy", { enumerable: true, get: function () { return mint_1.mintWithUserProxy; } });
var mint_2 = require("./mint");
Object.defineProperty(exports, "getTermExpiration", { enumerable: true, get: function () { return mint_2.getTermExpiration; } });
var mint_3 = require("./mint");
Object.defineProperty(exports, "getTermPosition", { enumerable: true, get: function () { return mint_3.getTermPosition; } });
var swap_1 = require("./swap");
Object.defineProperty(exports, "swap", { enumerable: true, get: function () { return swap_1.swap; } });
var joinPool_1 = require("./joinPool");
Object.defineProperty(exports, "joinConvergentPool", { enumerable: true, get: function () { return joinPool_1.joinConvergentPool; } });
var joinPool_2 = require("./joinPool");
Object.defineProperty(exports, "joinWeightedPool", { enumerable: true, get: function () { return joinPool_2.joinWeightedPool; } });
var exitPool_1 = require("./exitPool");
Object.defineProperty(exports, "exitConvergentPool", { enumerable: true, get: function () { return exitPool_1.exitConvergentPool; } });
var exitPool_2 = require("./exitPool");
Object.defineProperty(exports, "WeightedPoolExitKind", { enumerable: true, get: function () { return exitPool_2.WeightedPoolExitKind; } });
var exitPool_3 = require("./exitPool");
Object.defineProperty(exports, "exitWeightedPool", { enumerable: true, get: function () { return exitPool_3.exitWeightedPool; } });
var calcFixedAPR_1 = require("./helpers/calcFixedAPR");
Object.defineProperty(exports, "calcFixedAPR", { enumerable: true, get: function () { return calcFixedAPR_1.calcFixedAPR; } });
var calcPoolSwap_1 = require("./helpers/calcPoolSwap");
Object.defineProperty(exports, "calcSwapOutGivenInCCPoolUnsafe", { enumerable: true, get: function () { return calcPoolSwap_1.calcSwapOutGivenInCCPoolUnsafe; } });
var calcPoolSwap_2 = require("./helpers/calcPoolSwap");
Object.defineProperty(exports, "calcSwapInGivenOutCCPoolUnsafe", { enumerable: true, get: function () { return calcPoolSwap_2.calcSwapInGivenOutCCPoolUnsafe; } });
var calcPoolSwap_3 = require("./helpers/calcPoolSwap");
Object.defineProperty(exports, "calcSwapOutGivenInWeightedPoolUnsafe", { enumerable: true, get: function () { return calcPoolSwap_3.calcSwapOutGivenInWeightedPoolUnsafe; } });
var calcPoolSwap_4 = require("./helpers/calcPoolSwap");
Object.defineProperty(exports, "calcSwapInGivenOutWeightedPoolUnsafe", { enumerable: true, get: function () { return calcPoolSwap_4.calcSwapInGivenOutWeightedPoolUnsafe; } });
var calcSpotPrice_1 = require("./helpers/calcSpotPrice");
Object.defineProperty(exports, "calcSpotPricePt", { enumerable: true, get: function () { return calcSpotPrice_1.calcSpotPricePt; } });
var calcSpotPrice_2 = require("./helpers/calcSpotPrice");
Object.defineProperty(exports, "calcSpotPriceYt", { enumerable: true, get: function () { return calcSpotPrice_2.calcSpotPriceYt; } });
var getElementAddresses_1 = require("./helpers/getElementAddresses");
Object.defineProperty(exports, "PoolType", { enumerable: true, get: function () { return getElementAddresses_1.PoolType; } });
var getElementAddresses_2 = require("./helpers/getElementAddresses");
Object.defineProperty(exports, "getElementDeploymentAddresses", { enumerable: true, get: function () { return getElementAddresses_2.getElementDeploymentAddresses; } });
var getElementAddresses_3 = require("./helpers/getElementAddresses");
Object.defineProperty(exports, "getElementTermFactoryAddresses", { enumerable: true, get: function () { return getElementAddresses_3.getElementTermFactoryAddresses; } });
var getElementAddresses_4 = require("./helpers/getElementAddresses");
Object.defineProperty(exports, "getElementTermAddresses", { enumerable: true, get: function () { return getElementAddresses_4.getElementTermAddresses; } });
var getElementAddresses_5 = require("./helpers/getElementAddresses");
Object.defineProperty(exports, "getElementPtPoolAddresses", { enumerable: true, get: function () { return getElementAddresses_5.getElementPtPoolAddresses; } });
var getElementAddresses_6 = require("./helpers/getElementAddresses");
Object.defineProperty(exports, "getElementYtPoolAddresses", { enumerable: true, get: function () { return getElementAddresses_6.getElementYtPoolAddresses; } });
var getElementAddresses_7 = require("./helpers/getElementAddresses");
Object.defineProperty(exports, "getPoolIdByTermAddress", { enumerable: true, get: function () { return getElementAddresses_7.getPoolIdByTermAddress; } });
var getElementAddresses_8 = require("./helpers/getElementAddresses");
Object.defineProperty(exports, "getBaseTokenAddress", { enumerable: true, get: function () { return getElementAddresses_8.getBaseTokenAddress; } });
var getLatestBlockTimestamp_1 = require("./helpers/getLatestBlockTimestamp");
Object.defineProperty(exports, "getLatestBlockTimestamp", { enumerable: true, get: function () { return getLatestBlockTimestamp_1.getLatestBlockTimestamp; } });
var getPoolId_1 = require("./helpers/getPoolId");
Object.defineProperty(exports, "getPoolId", { enumerable: true, get: function () { return getPoolId_1.getPoolId; } });
var getReserves_1 = require("./helpers/getReserves");
Object.defineProperty(exports, "getReserves", { enumerable: true, get: function () { return getReserves_1.getReserves; } });
var getTermTokenSymbols_1 = require("./helpers/getTermTokenSymbols");
Object.defineProperty(exports, "TermTokenSymbolsResult", { enumerable: true, get: function () { return getTermTokenSymbols_1.TermTokenSymbolsResult; } });
var getTermByTokenSymbol_1 = require("./helpers/getTermByTokenSymbol");
Object.defineProperty(exports, "getTermByTokenSymbol", { enumerable: true, get: function () { return getTermByTokenSymbol_1.getTermByTokenSymbol; } });
var getTerms_1 = require("./helpers/getTerms");
Object.defineProperty(exports, "getTerms", { enumerable: true, get: function () { return getTerms_1.getTerms; } });
var getTermTokenSymbols_2 = require("./helpers/getTermTokenSymbols");
Object.defineProperty(exports, "getTermTokenSymbols", { enumerable: true, get: function () { return getTermTokenSymbols_2.getTermTokenSymbols; } });
var getTimeUntilExpiration_1 = require("./helpers/getTimeUntilExpiration");
Object.defineProperty(exports, "getTimeUntilExpiration", { enumerable: true, get: function () { return getTimeUntilExpiration_1.getTimeUntilExpiration; } });
var getTotalSupply_1 = require("./helpers/getTotalSupply");
Object.defineProperty(exports, "getTotalSupply", { enumerable: true, get: function () { return getTotalSupply_1.getTotalSupply; } });
var getUnitSeconds_1 = require("./helpers/getUnitSeconds");
Object.defineProperty(exports, "getUnitSeconds", { enumerable: true, get: function () { return getUnitSeconds_1.getUnitSeconds; } });
var time_1 = require("./constants/time");
Object.defineProperty(exports, "ONE_MINUTE_IN_SECONDS", { enumerable: true, get: function () { return time_1.ONE_MINUTE_IN_SECONDS; } });
var time_2 = require("./constants/time");
Object.defineProperty(exports, "ONE_HOUR_IN_SECONDS", { enumerable: true, get: function () { return time_2.ONE_HOUR_IN_SECONDS; } });
var time_3 = require("./constants/time");
Object.defineProperty(exports, "ONE_DAY_IN_SECONDS", { enumerable: true, get: function () { return time_3.ONE_DAY_IN_SECONDS; } });
var time_4 = require("./constants/time");
Object.defineProperty(exports, "ONE_WEEK_IN_SECONDS", { enumerable: true, get: function () { return time_4.ONE_WEEK_IN_SECONDS; } });
var time_5 = require("./constants/time");
Object.defineProperty(exports, "THIRTY_DAYS_IN_SECONDS", { enumerable: true, get: function () { return time_5.THIRTY_DAYS_IN_SECONDS; } });
var time_6 = require("./constants/time");
Object.defineProperty(exports, "SIX_MONTHS_IN_SECONDS", { enumerable: true, get: function () { return time_6.SIX_MONTHS_IN_SECONDS; } });
var time_7 = require("./constants/time");
Object.defineProperty(exports, "ONE_YEAR_IN_SECONDS", { enumerable: true, get: function () { return time_7.ONE_YEAR_IN_SECONDS; } });
var time_8 = require("./constants/time");
Object.defineProperty(exports, "ONE_MINUTE_IN_MILLISECONDS", { enumerable: true, get: function () { return time_8.ONE_MINUTE_IN_MILLISECONDS; } });
var time_9 = require("./constants/time");
Object.defineProperty(exports, "ONE_HOUR_IN_MILLISECONDS", { enumerable: true, get: function () { return time_9.ONE_HOUR_IN_MILLISECONDS; } });
var time_10 = require("./constants/time");
Object.defineProperty(exports, "ONE_DAY_IN_MILLISECONDS", { enumerable: true, get: function () { return time_10.ONE_DAY_IN_MILLISECONDS; } });
var time_11 = require("./constants/time");
Object.defineProperty(exports, "ONE_WEEK_IN_MILLISECONDS", { enumerable: true, get: function () { return time_11.ONE_WEEK_IN_MILLISECONDS; } });
var time_12 = require("./constants/time");
Object.defineProperty(exports, "ONE_YEAR_IN_MILLISECONDS", { enumerable: true, get: function () { return time_12.ONE_YEAR_IN_MILLISECONDS; } });
var time_13 = require("./constants/time");
Object.defineProperty(exports, "THIRTY_DAYS_IN_MILLISECONDS", { enumerable: true, get: function () { return time_13.THIRTY_DAYS_IN_MILLISECONDS; } });
