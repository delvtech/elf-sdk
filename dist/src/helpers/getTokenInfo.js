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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getYieldPoolTokenInfos = exports.getPoolInfoForPrincipalToken = exports.getPrincipalTokenInfoForPool = exports.getPrincipalTokenInfos = exports.getAssetProxyTokenInfos = exports.getTokenInfo = exports.initTokenList = void 0;
var lodash_keyby_1 = __importDefault(require("lodash.keyby"));
var elf_tokenlist_1 = require("elf-tokenlist");
/**
 * Init the tokenlist for given chain
 * @param chainName name of the chain that the tokenlist represents
 * @returns InitTokenListResult
 */
function initTokenList(chainName) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    var tokenList = require("elf-tokenlist/dist/" + chainName + ".tokenlist.json");
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    var addressesJson = require("elf-tokenlist/dist/" + chainName + ".addresses.json");
    var tokenInfos = tokenList.tokens;
    var tokenInfoByAddress = (0, lodash_keyby_1.default)(tokenInfos, "address");
    return { tokenList: tokenList, addressesJson: addressesJson, tokenInfoByAddress: tokenInfoByAddress };
}
exports.initTokenList = initTokenList;
/**
 * Helper function for looking up a tokenlist info
 * @param address address of the token
 * @param tokenInfoByAddress mapping of TokenInfos by address
 * @returns TokenInfo associated with the address param
 */
function getTokenInfo(address, tokenInfoByAddress) {
    return tokenInfoByAddress[address];
}
exports.getTokenInfo = getTokenInfo;
function isAssetProxy(tokenInfo) {
    var _a;
    return !!((_a = tokenInfo.tags) === null || _a === void 0 ? void 0 : _a.includes(elf_tokenlist_1.TokenTag.ASSET_PROXY));
}
/**
 * Finds tokenInfos for AssetProxies.
 * @param tokenInfos
 * @returns list of AssetProxyTokenInfo
 */
function getAssetProxyTokenInfos(tokenInfos) {
    return tokenInfos.filter(function (tokenInfo) {
        return isAssetProxy(tokenInfo);
    });
}
exports.getAssetProxyTokenInfos = getAssetProxyTokenInfos;
function isPrincipalToken(tokenInfo) {
    var _a;
    return !!((_a = tokenInfo === null || tokenInfo === void 0 ? void 0 : tokenInfo.tags) === null || _a === void 0 ? void 0 : _a.includes(elf_tokenlist_1.TokenTag.PRINCIPAL));
}
/**
 * Finds tokenInfos for Principal Tokens
 * @param tokenInfos
 * @returns list of PrincipalTokenInfo
 */
function getPrincipalTokenInfos(tokenInfos) {
    return tokenInfos.filter(function (tokenInfo) {
        return isPrincipalToken(tokenInfo);
    });
}
exports.getPrincipalTokenInfos = getPrincipalTokenInfos;
function isPrincipalPool(tokenInfo) {
    var _a;
    return !!((_a = tokenInfo.tags) === null || _a === void 0 ? void 0 : _a.includes(elf_tokenlist_1.TokenTag.CCPOOL));
}
/**
 * Returns a PrincipalTokenInfo given a TokenInfo for a pool
 * @param poolInfo
 * @param tokenInfos
 * @returns PrincipalTokenInfo
 */
function getPrincipalTokenInfoForPool(poolInfo, tokenInfos) {
    var principalTokenInfos = getPrincipalTokenInfos(tokenInfos);
    if (isPrincipalPool(poolInfo)) {
        var trancheAddress_1 = poolInfo.extensions.bond;
        var trancheInfo_1 = principalTokenInfos.find(function (info) { return info.address === trancheAddress_1; });
        return trancheInfo_1;
    }
    var interestTokenAddress = poolInfo.extensions.interestToken;
    var trancheInfo = principalTokenInfos.find(function (info) { return info.extensions.interestToken === interestTokenAddress; });
    return trancheInfo;
}
exports.getPrincipalTokenInfoForPool = getPrincipalTokenInfoForPool;
/**
 * Returns the TokenInfo of the pool corresponding to a Principal Token
 * @param principalTokenAddress
 * @param tokenInfos
 * @returns PrincipalPoolTokenInfo
 */
function getPoolInfoForPrincipalToken(principalTokenAddress, tokenInfos) {
    var principalPools = tokenInfos.filter(function (tokenInfo) {
        return isPrincipalPool(tokenInfo);
    });
    return principalPools.find(function (_a) {
        var bond = _a.extensions.bond;
        return bond === principalTokenAddress;
    });
}
exports.getPoolInfoForPrincipalToken = getPoolInfoForPrincipalToken;
function isYieldPool(tokenInfo) {
    var _a;
    return !!((_a = tokenInfo.tags) === null || _a === void 0 ? void 0 : _a.includes(elf_tokenlist_1.TokenTag.WPOOL));
}
/**
 * Returns the TokenInfos for the Yield Pools
 * @param tokenInfos
 * @returns a list of YieldPoolTokenInfo
 */
function getYieldPoolTokenInfos(tokenInfos) {
    return tokenInfos.filter(function (tokenInfo) {
        return isYieldPool(tokenInfo);
    });
}
exports.getYieldPoolTokenInfos = getYieldPoolTokenInfos;
