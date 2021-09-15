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
exports.getTermPosition = exports.getTermExpiration = exports.mintWithUserProxy = exports.ETH_SENTINEL_ADDRESS = void 0;
var elf_contracts_typechain_1 = require("elf-contracts-typechain");
var utils_1 = require("ethers/lib/utils");
exports.ETH_SENTINEL_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
/**
 * Mints new principal and yield tokens for a given amount of base asset.  The base asset must match
 * the term's underlying.  For terms that accept WETH, ETH can also be used by supplying the ETH_SENTINEL_ADDRESS.
 * @param userProxyContractAddress address of Element's UserProxy
 * @param termExpiration the exiration date of the term in unix seconds
 * @param termPosition the address of the term's wrapped position
 * @param baseAssetAmount the amount of base asset to deposit, i.e. "3.14" Ether
 * @param baseAssetAddress the address of the token to deposit. Use
 * ETH_SENTINEL_ADDRESS to mint with Ether.
 * @param baseAssetDecimals the decimal precision of the asset, i.e. 18 for Ether
 * @param signerOrProvider
 */
function mintWithUserProxy(userProxyContractAddress, termExpiration, termPosition, baseAssetAmount, baseAssetAddress, baseAssetDecimals, signerOrProvider, overrides) {
    return __awaiter(this, void 0, void 0, function () {
        var userProxyContract, value, mintTx, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    userProxyContract = elf_contracts_typechain_1.UserProxy__factory.connect(userProxyContractAddress, signerOrProvider);
                    value = (0, utils_1.parseUnits)(baseAssetAmount, baseAssetDecimals);
                    if (!(overrides === undefined)) return [3 /*break*/, 2];
                    return [4 /*yield*/, userProxyContract.mint(value, baseAssetAddress, termExpiration, termPosition, [])];
                case 1:
                    _a = _b.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, userProxyContract.mint(value, baseAssetAddress, termExpiration, termPosition, [], overrides)];
                case 3:
                    _a = _b.sent();
                    _b.label = 4;
                case 4:
                    mintTx = _a;
                    return [2 /*return*/, mintTx];
            }
        });
    });
}
exports.mintWithUserProxy = mintWithUserProxy;
/**
 * get the expiration time in unix seconds for a term.  returns a BigNumber that can be converted
 * to a number with BigNumber.toNumber()
 * @param termAddress the address of the term
 * @param signerOrProvider
 * @returns
 */
function getTermExpiration(termAddress, signerOrProvider) {
    return __awaiter(this, void 0, void 0, function () {
        var termContract, expiration;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    termContract = elf_contracts_typechain_1.Tranche__factory.connect(termAddress, signerOrProvider);
                    return [4 /*yield*/, termContract.unlockTimestamp()];
                case 1:
                    expiration = _a.sent();
                    return [2 /*return*/, expiration];
            }
        });
    });
}
exports.getTermExpiration = getTermExpiration;
/**
 * returns the wrapped position address for a given term
 * @param termAddress the address of the term
 * @param signerOrProvider
 * @returns
 */
function getTermPosition(termAddress, signerOrProvider) {
    return __awaiter(this, void 0, void 0, function () {
        var termContract, position;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    termContract = elf_contracts_typechain_1.Tranche__factory.connect(termAddress, signerOrProvider);
                    return [4 /*yield*/, termContract.position()];
                case 1:
                    position = _a.sent();
                    return [2 /*return*/, position];
            }
        });
    });
}
exports.getTermPosition = getTermPosition;
