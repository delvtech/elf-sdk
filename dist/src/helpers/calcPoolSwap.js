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
exports.calcSwapInGivenOutWeightedPoolUnsafe = exports.calcSwapOutGivenInWeightedPoolUnsafe = exports.calcSwapInGivenOutCCPoolUnsafe = exports.calcSwapOutGivenInCCPoolUnsafe = void 0;
function calcSwapOutGivenInCCPoolUnsafe(xAmount, xReserves, yReserves, totalSupply, timeRemainingSeconds, tParamSeconds, baseAssetIn) {
    var tS = +totalSupply;
    var amountX = +xAmount;
    var xR = +xReserves + tS;
    var yR = +yReserves;
    if (baseAssetIn) {
        xR = +xReserves;
        yR = +yReserves + tS;
    }
    var t = timeRemainingSeconds / tParamSeconds;
    var xBefore = Math.pow(xR, (1 - t));
    var yBefore = Math.pow(yR, (1 - t));
    var xAfter = Math.pow((xR + amountX), (1 - t));
    // this is the real equation, make ascii art for it
    var yAfter = Math.pow((xBefore + yBefore - xAfter), (1 / (1 - t)));
    var amountY = yR - yAfter;
    return amountY;
}
exports.calcSwapOutGivenInCCPoolUnsafe = calcSwapOutGivenInCCPoolUnsafe;
function calcSwapInGivenOutCCPoolUnsafe(xAmount, xReserves, yReserves, totalSupply, timeRemainingSeconds, tParamSeconds, baseAssetIn) {
    var tS = +totalSupply;
    var amountX = +xAmount;
    var xR = +xReserves + tS;
    var yR = +yReserves;
    if (baseAssetIn) {
        xR = +xReserves;
        yR = +yReserves + tS;
    }
    var t = timeRemainingSeconds / tParamSeconds;
    var xBefore = Math.pow(xR, (1 - t));
    var yBefore = Math.pow(yR, (1 - t));
    var xAfter = Math.pow((xR - amountX), (1 - t));
    // this is the real equation, make ascii art for it
    var yAfter = Math.pow((xBefore + yBefore - xAfter), (1 / (1 - t)));
    var amountY = yAfter - yR;
    return amountY;
}
exports.calcSwapInGivenOutCCPoolUnsafe = calcSwapInGivenOutCCPoolUnsafe;
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
function calcSwapOutGivenInWeightedPoolUnsafe(amountIn, balanceOut, balanceIn) {
    var aI = +amountIn;
    var bO = +balanceOut;
    var bI = +balanceIn;
    var amountOut = bO * (1 - bI / (bI + aI));
    return amountOut;
}
exports.calcSwapOutGivenInWeightedPoolUnsafe = calcSwapOutGivenInWeightedPoolUnsafe;
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
function calcSwapInGivenOutWeightedPoolUnsafe(amountOut, balanceOut, balanceIn) {
    var aO = +amountOut;
    var bO = +balanceOut;
    var bI = +balanceIn;
    var amountIn = bI * (bO / (bO - aO) - 1);
    return amountIn;
}
exports.calcSwapInGivenOutWeightedPoolUnsafe = calcSwapInGivenOutWeightedPoolUnsafe;
