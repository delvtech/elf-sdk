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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var hardhat_1 = require("hardhat");
var getTotalSupply_1 = require("../src/helpers/getTotalSupply");
var getReserves_1 = require("../src/helpers/getReserves");
var calcSpotPrice_1 = require("../src/helpers/calcSpotPrice");
var getTimeUntilExpiration_1 = require("../src/helpers/getTimeUntilExpiration");
var getLatestBlockTimestamp_1 = require("../src/helpers/getLatestBlockTimestamp");
var getUnitSeconds_1 = require("../src/helpers/getUnitSeconds");
var calcFixedAPR_1 = require("../src/helpers/calcFixedAPR");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var balVault, base, signer, ptPool, totalSupply, reserves, ptIndex, baseIndex, ptReserves, baseReserves, baseDecimals, blockTimestamp, timeRemainingSeconds, unitSeconds, ptSpotPrice, ytPool, ytIndex, ytReserves, ytSpotPrice, fixedAPR;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    balVault = "0x65748E8287Ce4B9E6D83EE853431958851550311";
                    base = "0x9A1000D492d40bfccbc03f413A48F5B6516Ec0Fd".toLowerCase();
                    return [4 /*yield*/, hardhat_1.ethers.getSigners()];
                case 1:
                    signer = (_a.sent())[0];
                    ptPool = "0x9eB7F54C0eCc4d0D2dfF28a1276e36d598F2B0D1";
                    return [4 /*yield*/, (0, getTotalSupply_1.getTotalSupply)(ptPool, signer)];
                case 2:
                    totalSupply = _a.sent();
                    return [4 /*yield*/, (0, getReserves_1.getReserves)(ptPool, balVault, signer)];
                case 3:
                    reserves = _a.sent();
                    ptIndex = reserves.tokens[0].toLowerCase() == base ? 1 : 0;
                    baseIndex = reserves.tokens[0].toLowerCase() == base ? 0 : 1;
                    ptReserves = reserves.balances[ptIndex];
                    baseReserves = reserves.balances[baseIndex];
                    baseDecimals = reserves.decimals[baseIndex];
                    return [4 /*yield*/, (0, getLatestBlockTimestamp_1.getLatestBlockTimestamp)()];
                case 4:
                    blockTimestamp = _a.sent();
                    return [4 /*yield*/, (0, getTimeUntilExpiration_1.getTimeUntilExpiration)(ptPool, signer, blockTimestamp)];
                case 5:
                    timeRemainingSeconds = _a.sent();
                    return [4 /*yield*/, (0, getUnitSeconds_1.getUnitSeconds)(ptPool, signer)];
                case 6:
                    unitSeconds = _a.sent();
                    ptSpotPrice = (0, calcSpotPrice_1.calcSpotPricePt)(baseReserves.toString(), ptReserves.toString(), totalSupply.toString(), timeRemainingSeconds, unitSeconds, baseDecimals);
                    console.log("\nPrincipal Token");
                    console.log("totalSupply: " + totalSupply);
                    console.log("ptReserves: " + ptReserves);
                    console.log("baseReserves: " + baseReserves);
                    console.log("timeRemainingSeconds: " + timeRemainingSeconds);
                    console.log("unitSeconds: " + unitSeconds);
                    console.log("ptSpotPrice: " + ptSpotPrice);
                    ytPool = "0xD75bfF2444FF738d443066ff4688691e6852b217";
                    return [4 /*yield*/, (0, getReserves_1.getReserves)(ytPool, balVault, signer)];
                case 7:
                    reserves = _a.sent();
                    ytIndex = reserves.tokens[0].toLowerCase() == base ? 1 : 0;
                    baseIndex = reserves.tokens[0].toLowerCase() == base ? 0 : 1;
                    ytReserves = reserves.balances[ytIndex];
                    baseReserves = reserves.balances[baseIndex];
                    ytSpotPrice = (0, calcSpotPrice_1.calcSpotPriceYt)(baseReserves.toString(), ytReserves.toString());
                    console.log("\nYield Token");
                    console.log("ytReserves: " + ytReserves);
                    console.log("baseReserves: " + baseReserves);
                    console.log("ytSpotPrice: " + ytSpotPrice);
                    fixedAPR = (0, calcFixedAPR_1.calcFixedAPR)(ptSpotPrice, timeRemainingSeconds);
                    console.log("\nFixed APR");
                    console.log("fixedAPR: " + fixedAPR);
                    return [2 /*return*/];
            }
        });
    });
}
main();
