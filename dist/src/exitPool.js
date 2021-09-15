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
exports.exitWeightedPool = exports.WeightedPoolExitKind = exports.exitConvergentPool = void 0;
var elf_contracts_typechain_1 = require("elf-contracts-typechain");
var utils_1 = require("ethers/lib/utils");
/**
 * Remove liquidity from a ConvergentCurvePool.
 * @param signer Who is authorizing the transaction
 * @param poolId Balancer V2 PoolId
 * @param senderAddress who is returning LP token to the pool
 * @param receipientAddress who is receiving assets from the pool
 * @param vaultAddress Balancer V2 Vault address
 * @param tokens tokens to withdraw, note: sorted alphanumerically.  ETH must be sorted as though it
 * were WETH.
 * @param minAmountsOut minimum amounts to withdraw, same order as tokens.  The minimum amounts can
 * be set to ensure slippage tolerance.
 * @param fromInternalBalance Use the sender's Balancer V2 internal balance first, if available.
 * @returns returns the contract transaction.
 */
function exitConvergentPool(signer, poolId, senderAddress, receipientAddress, vaultAddress, tokens, minAmountsOut, toInternalBalance) {
    if (toInternalBalance === void 0) { toInternalBalance = false; }
    return __awaiter(this, void 0, void 0, function () {
        var userData, exitRequest, vaultContract, exitReceipt;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userData = utils_1.defaultAbiCoder.encode(["uint256[]"], [minAmountsOut]);
                    exitRequest = {
                        assets: tokens,
                        minAmountsOut: minAmountsOut,
                        userData: userData,
                        toInternalBalance: toInternalBalance,
                    };
                    vaultContract = elf_contracts_typechain_1.Vault__factory.connect(vaultAddress, signer);
                    return [4 /*yield*/, vaultContract.exitPool(poolId, senderAddress, receipientAddress, exitRequest)];
                case 1:
                    exitReceipt = _a.sent();
                    return [2 /*return*/, exitReceipt];
            }
        });
    });
}
exports.exitConvergentPool = exitConvergentPool;
var WeightedPoolExitKind;
(function (WeightedPoolExitKind) {
    WeightedPoolExitKind[WeightedPoolExitKind["EXACT_BPT_IN_FOR_ONE_TOKEN_OUT"] = 0] = "EXACT_BPT_IN_FOR_ONE_TOKEN_OUT";
    WeightedPoolExitKind[WeightedPoolExitKind["EXACT_BPT_IN_FOR_TOKENS_OUT"] = 1] = "EXACT_BPT_IN_FOR_TOKENS_OUT";
    WeightedPoolExitKind[WeightedPoolExitKind["BPT_IN_FOR_EXACT_TOKENS_OUT"] = 2] = "BPT_IN_FOR_EXACT_TOKENS_OUT";
})(WeightedPoolExitKind = exports.WeightedPoolExitKind || (exports.WeightedPoolExitKind = {}));
/**
 * Remove liquidity from a WeightedPool.
 * @param signer Who is authorizing the transaction
 * @param poolId Balancer V2 PoolId
 * @param senderAddress who is returning LP token to the pool
 * @param receipientAddress who is receiving assets from the pool
 * @param vaultAddress Balancer V2 Vault address
 * @param tokens tokens to withdraw, note: sorted alphanumerically.  ETH must be sorted as though it
 * were WETH.
 * @param minAmountsOut minimum amounts to withdraw, same order as tokens.  The minimum amounts can
 * be set to ensure slippage tolerance.
 * @param fromInternalBalance Use the sender's Balancer V2 internal balance first, if available.
 * @param exitKind The exit operation
 * @param maxBPTIn The amount, or max amount of Balancer Pool Token in, depending on the exitKind.
 * @param tokenIndex If withdrawing a single token, the index of the token in tokens
 * @returns returns the contract transaction.
 */
function exitWeightedPool(signer, poolId, senderAddress, receipientAddress, vaultAddress, tokens, minAmountsOut, toInternalBalance, exitKind, maxBPTIn, tokenIndex) {
    if (toInternalBalance === void 0) { toInternalBalance = false; }
    if (exitKind === void 0) { exitKind = WeightedPoolExitKind.EXACT_BPT_IN_FOR_TOKENS_OUT; }
    return __awaiter(this, void 0, void 0, function () {
        var userData, exitRequest, vaultContract, exitReceipt;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userData = getUserData(exitKind, minAmountsOut, maxBPTIn, tokenIndex);
                    exitRequest = {
                        assets: tokens,
                        minAmountsOut: minAmountsOut,
                        userData: userData,
                        toInternalBalance: toInternalBalance,
                    };
                    vaultContract = elf_contracts_typechain_1.Vault__factory.connect(vaultAddress, signer);
                    return [4 /*yield*/, vaultContract.exitPool(poolId, senderAddress, receipientAddress, exitRequest)];
                case 1:
                    exitReceipt = _a.sent();
                    return [2 /*return*/, exitReceipt];
            }
        });
    });
}
exports.exitWeightedPool = exitWeightedPool;
function getUserData(exitKind, minAmountsOut, maxBPTIn, tokenIndex) {
    switch (exitKind) {
        // bptInForExactTokensOut
        //     (, amountsOut, maxBPTAmountIn) = abi.decode(self, (WeightedPool.ExitKind, uint256[], uint256));
        case WeightedPoolExitKind.BPT_IN_FOR_EXACT_TOKENS_OUT: {
            var userData = utils_1.defaultAbiCoder.encode(["uint8", "uint256[]", "uint256"], [exitKind, minAmountsOut, maxBPTIn]);
            return userData;
        }
        // exactBptInForTokenOut
        //     (, bptAmountIn, tokenIndex) = abi.decode(self, (WeightedPool.ExitKind, uint256, uint256));
        case WeightedPoolExitKind.EXACT_BPT_IN_FOR_ONE_TOKEN_OUT: {
            tokenIndex !== null && tokenIndex !== void 0 ? tokenIndex : console.error("tokenIndex is required for EXACT_BPT_IN_FOR_ONE_TOKEN_OUT");
            var userData = utils_1.defaultAbiCoder.encode(["uint8", "uint256", "uint256"], [exitKind, maxBPTIn, tokenIndex]);
            return userData;
        }
        // exactBptInForTokensOut
        //     (, bptAmountIn) = abi.decode(self, (WeightedPool.ExitKind, uint256));
        case WeightedPoolExitKind.EXACT_BPT_IN_FOR_TOKENS_OUT: {
            var userData = utils_1.defaultAbiCoder.encode(["uint8", "uint256"], [exitKind, maxBPTIn]);
            return userData;
        }
        default:
            // should never get here.
            return "";
    }
}
