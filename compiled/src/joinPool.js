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
exports.joinWeightedPool = exports.joinConvergentPool = void 0;
var elf_contracts_typechain_1 = require("elf-contracts-typechain");
var ethers_1 = require("ethers");
var utils_1 = require("ethers/lib/utils");
/**
 * Add liquidity to a ConvergentCurvePool.
 * @param signer Who is authorizing the transaction
 * @param poolId Balancer V2 PoolId
 * @param senderAddress who is depositing the money into the pool
 * @param receipientAddress who is receiving the LP token
 * @param vaultAddress Balancer V2 Vault address
 * @param tokens tokens to deposit, note: sorted alphanumerically.  ETH must be sorted as though it
 * were WETH.
 * @param maxAmountsIn maximum amounts to deposit, same order as tokens.
 * @param fromInternalBalance Use the sender's Balancer V2 internal balance first, if available.
 * @returns returns the contract transaction.
 */
function joinConvergentPool(signer, poolId, senderAddress, receipientAddress, vaultAddress, tokens, maxAmountsIn, fromInternalBalance) {
    if (fromInternalBalance === void 0) { fromInternalBalance = false; }
    return __awaiter(this, void 0, void 0, function () {
        var userData, joinRequest, vaultContract, joinReceipt;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userData = utils_1.defaultAbiCoder.encode(["uint256[]"], [maxAmountsIn]);
                    joinRequest = {
                        assets: tokens,
                        maxAmountsIn: maxAmountsIn,
                        userData: userData,
                        fromInternalBalance: fromInternalBalance,
                    };
                    vaultContract = elf_contracts_typechain_1.Vault__factory.connect(vaultAddress, signer);
                    return [4 /*yield*/, vaultContract.joinPool(poolId, senderAddress, receipientAddress, joinRequest)];
                case 1:
                    joinReceipt = _a.sent();
                    return [2 /*return*/, joinReceipt];
            }
        });
    });
}
exports.joinConvergentPool = joinConvergentPool;
var ZeroBigNumber = ethers_1.BigNumber.from(0);
var WeightedPoolJoinKind;
(function (WeightedPoolJoinKind) {
    WeightedPoolJoinKind[WeightedPoolJoinKind["INIT"] = 0] = "INIT";
    WeightedPoolJoinKind[WeightedPoolJoinKind["EXACT_TOKENS_IN_FOR_BPT_OUT"] = 1] = "EXACT_TOKENS_IN_FOR_BPT_OUT";
    WeightedPoolJoinKind[WeightedPoolJoinKind["TOKEN_IN_FOR_EXACT_BPT_OUT"] = 2] = "TOKEN_IN_FOR_EXACT_BPT_OUT";
})(WeightedPoolJoinKind || (WeightedPoolJoinKind = {}));
/**
 * Add liquidity to a WeightedPool.
 * @param signer who is authorizing the transaction.
 * @param poolId Balancer V2 PoolId.
 * @param senderAddress who is depositing the money into the pool.
 * @param receipientAddress who is receiving the LP token.
 * @param vaultAddress Balancer V2 Vault address.
 * @param tokens tokens to deposit, note: sorted alphanumerically.  ETH must be sorted as though it
 * were WETH.
 * @param maxAmountsIn maximum amounts to deposit, same order as tokens.
 * @param minBPTOut minimun amount of LP out, setting this creates a slippage tolerangs.
 * @param fromInternalBalance use the sender's Balancer V2 internal balance first, if available.
 * @param joinKind
 * @returns returns the contract transaction.
 */
function joinWeightedPool(signer, poolId, senderAddress, receipientAddress, vaultAddress, tokens, maxAmountsIn, minBPTOut, fromInternalBalance, joinKind) {
    if (minBPTOut === void 0) { minBPTOut = ZeroBigNumber; }
    if (fromInternalBalance === void 0) { fromInternalBalance = false; }
    if (joinKind === void 0) { joinKind = WeightedPoolJoinKind.EXACT_TOKENS_IN_FOR_BPT_OUT; }
    return __awaiter(this, void 0, void 0, function () {
        var userData, joinRequest, vaultContract, joinReceipt;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userData = utils_1.defaultAbiCoder.encode(["uint8", "uint256[]", "uint256"], [joinKind, maxAmountsIn, minBPTOut]);
                    joinRequest = {
                        assets: tokens,
                        maxAmountsIn: maxAmountsIn,
                        userData: userData,
                        fromInternalBalance: fromInternalBalance,
                    };
                    vaultContract = elf_contracts_typechain_1.Vault__factory.connect(vaultAddress, signer);
                    return [4 /*yield*/, vaultContract.joinPool(poolId, senderAddress, receipientAddress, joinRequest)];
                case 1:
                    joinReceipt = _a.sent();
                    return [2 /*return*/, joinReceipt];
            }
        });
    });
}
exports.joinWeightedPool = joinWeightedPool;
