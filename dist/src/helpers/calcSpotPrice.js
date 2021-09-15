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
exports.calcSpotPriceYt = exports.calcSpotPricePt = void 0;
function calcSpotPricePt(baseReserves, ptReserves, totalSupply, timeRemainingSeconds, tParamSeconds, decimals) {
    // normalize decimal places of precision to 18
    if (decimals < 0 || decimals > 18) {
        // return 0 if decimals fall outside the range between 0 and 18
        return 0;
    }
    var diff = 18 - decimals;
    var normalizedBaseReserves = +baseReserves * Math.pow(10, diff);
    var normalizedPtReserves = +ptReserves * Math.pow(10, diff);
    var t = timeRemainingSeconds / tParamSeconds;
    return Math.pow((normalizedBaseReserves / (normalizedPtReserves + +totalSupply)), t);
}
exports.calcSpotPricePt = calcSpotPricePt;
function calcSpotPriceYt(baseReserves, ytReserves) {
    return +baseReserves / +ytReserves;
}
exports.calcSpotPriceYt = calcSpotPriceYt;
