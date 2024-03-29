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
var calcTotalValueLocked_1 = require("../src/helpers/calcTotalValueLocked");
var getTokenInfo_1 = require("../src/helpers/getTokenInfo");
var ts_money_1 = require("ts-money");
var getUnderlyingContractsByAddress_1 = require("../src/helpers/getUnderlyingContractsByAddress");
var getTokenPrice_1 = require("../src/prices/getTokenPrice");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var signer, chainName, tvl, currency, _a, tokenList, addressesJson, tokenInfoByAddress, assetProxyTokenInfos, principalTokenInfos, results;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, hardhat_1.ethers.getSigners()];
                case 1:
                    signer = (_b.sent())[0];
                    chainName = "mainnet";
                    return [4 /*yield*/, (0, calcTotalValueLocked_1.calcTotalValueLocked)(chainName, signer)];
                case 2:
                    tvl = _b.sent();
                    console.log("Total TVL: " + tvl.amount / 100);
                    currency = ts_money_1.Currencies.USD;
                    _a = (0, getTokenInfo_1.initTokenList)(chainName), tokenList = _a.tokenList, addressesJson = _a.addressesJson, tokenInfoByAddress = _a.tokenInfoByAddress;
                    assetProxyTokenInfos = (0, getTokenInfo_1.getAssetProxyTokenInfos)(tokenList.tokens);
                    principalTokenInfos = (0, getTokenInfo_1.getPrincipalTokenInfos)(tokenList.tokens);
                    return [4 /*yield*/, Promise.all(principalTokenInfos.map(function (tokenInfo) { return __awaiter(_this, void 0, void 0, function () {
                            var underlyingContractsByAddress, baseAssetContract, baseAssetPrice, termName, termTvl;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        underlyingContractsByAddress = (0, getUnderlyingContractsByAddress_1.getUnderlyingContractsByAddress)(chainName, signer);
                                        baseAssetContract = underlyingContractsByAddress[tokenInfo.extensions.underlying];
                                        return [4 /*yield*/, (0, getTokenPrice_1.getTokenPrice)(chainName, baseAssetContract, currency, signer)];
                                    case 1:
                                        baseAssetPrice = _a.sent();
                                        return [4 /*yield*/, baseAssetContract.name()];
                                    case 2:
                                        termName = _a.sent();
                                        return [4 /*yield*/, (0, calcTotalValueLocked_1.calcTotalValueLockedForTerm)(tokenInfo, addressesJson.addresses.balancerVaultAddress, underlyingContractsByAddress, assetProxyTokenInfos, tokenList.tokens, tokenInfoByAddress, baseAssetPrice, signer)];
                                    case 3:
                                        termTvl = _a.sent();
                                        return [2 /*return*/, { termName: termName, termTvl: termTvl }];
                                }
                            });
                        }); }))];
                case 3:
                    results = _b.sent();
                    results.forEach(function (result) {
                        console.log(result.termName + " TVL: " + result.termTvl.amount);
                    });
                    return [2 /*return*/];
            }
        });
    });
}
main();
