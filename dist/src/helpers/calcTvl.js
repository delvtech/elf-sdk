"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPoolTokens = exports.fetchBaseAssetReservesInPool = exports.getPrincipalTokenInfoForPool = exports.fetchAccumulatedInterestForTranche = exports.fetchTotalValueLockedForTerm = exports.useTotalValueLockedForPlatform = exports.isYieldPool = exports.getPoolForYieldToken = exports.getPoolInfoForPrincipalToken = exports.isPrincipalPool = exports.isPrincipalToken = exports.getTokenInfo = exports.AddressesJson = void 0;
var ts_money_1 = require("ts-money");
var utils_1 = require("ethers/lib/utils");
var keyby_1 = __importDefault(require("lodash/keyby"));
var Tranche__factory_1 = require("elf-contracts-typechain/dist/types/factories/Tranche__factory");
var YVaultAssetProxy__factory_1 = require("elf-contracts-typechain/dist/types/factories/YVaultAssetProxy__factory");
var Vault__factory_1 = require("elf-contracts-typechain/dist/types/factories/Vault__factory");
var WeightedPool__factory_1 = require("elf-contracts-typechain/dist/types/factories/WeightedPool__factory");
var ERC20__factory_1 = require("elf-contracts-typechain/dist/types/factories/ERC20__factory");
var getUnderlyingContractsByAddress_1 = require("src/helpers/getUnderlyingContractsByAddress");
var getTokenPrice_1 = require("src/helpers/getTokenPrice");
var TokenListTag;
(function (TokenListTag) {
    TokenListTag["VAULT"] = "vault";
    TokenListTag["ASSET_PROXY"] = "assetproxy";
    TokenListTag["CCPOOL"] = "ccpool";
    TokenListTag["PRINCIPAL"] = "eP";
    TokenListTag["UNDERLYING"] = "underlying";
    TokenListTag["WPOOL"] = "wpool";
    TokenListTag["YIELD"] = "eY";
})(TokenListTag || (TokenListTag = {}));
// TODO: make dynamic?
var chainName = "mainnet";
// eslint-disable-next-line @typescript-eslint/no-var-requires
var tokenListJson = require("elf-tokenlist/dist/" + chainName + ".tokenlist.json");
// eslint-disable-next-line @typescript-eslint/no-var-requires
exports.AddressesJson = require("elf-tokenlist/dist/" + chainName + ".addresses.json");
var principalTokenInfos = tokenListJson.tokens.filter(function (tokenInfo) {
    return isPrincipalToken(tokenInfo);
});
var yieldPools = tokenListJson.tokens.filter(function (tokenInfo) { return isYieldPool(tokenInfo); });
var assetProxyTokenInfos = tokenListJson.tokens.filter(function (tokenInfo) {
    return isAssetProxy(tokenInfo);
});
/**
 * Helper function for looking up a tokenlist info when you know the type of TokenInfo you want.
 * This is useful when you want strongly-typed properties for `extensions`, eg:
 *
 * const principalToken = getTokenInfo<PrincipalTokenInfo>('0xdeadbeef')
 * const { extensions: { underlying, ... } } = principalToken;
 */
function getTokenInfo(address) {
    var tokenInfos = tokenListJson.tokens;
    var TokenMetadata = (0, keyby_1.default)(tokenInfos, "address");
    return TokenMetadata[address];
}
exports.getTokenInfo = getTokenInfo;
function isPrincipalToken(tokenInfo) {
    var _a;
    return !!((_a = tokenInfo === null || tokenInfo === void 0 ? void 0 : tokenInfo.tags) === null || _a === void 0 ? void 0 : _a.includes(TokenListTag.PRINCIPAL));
}
exports.isPrincipalToken = isPrincipalToken;
function isPrincipalPool(tokenInfo) {
    var _a;
    return !!((_a = tokenInfo.tags) === null || _a === void 0 ? void 0 : _a.includes(TokenListTag.CCPOOL));
}
exports.isPrincipalPool = isPrincipalPool;
function getPoolInfoForPrincipalToken(principalTokenAddress) {
    var principalPools = tokenListJson.tokens.filter(function (tokenInfo) {
        return isPrincipalPool(tokenInfo);
    });
    return principalPools.find(function (_a) {
        var bond = _a.extensions.bond;
        return bond === principalTokenAddress;
    });
}
exports.getPoolInfoForPrincipalToken = getPoolInfoForPrincipalToken;
function getPoolForYieldToken(yieldTokenAddress, signerOrProvider) {
    var yieldPool = yieldPools.find(function (_a) {
        var interestToken = _a.extensions.interestToken;
        return interestToken === yieldTokenAddress;
    });
    var yieldPoolContracts = yieldPools.map(function (_a) {
        var address = _a.address;
        return WeightedPool__factory_1.WeightedPool__factory.connect(address, signerOrProvider);
    });
    var yieldPoolContractsByAddress = (0, keyby_1.default)(yieldPoolContracts, function (yieldPool) { return yieldPool.address; });
    return yieldPoolContractsByAddress[yieldPool.address];
}
exports.getPoolForYieldToken = getPoolForYieldToken;
function isYieldPool(tokenInfo) {
    var _a;
    return !!((_a = tokenInfo.tags) === null || _a === void 0 ? void 0 : _a.includes(TokenListTag.WPOOL));
}
exports.isYieldPool = isYieldPool;
function isAssetProxy(tokenInfo) {
    var _a;
    return !!((_a = tokenInfo.tags) === null || _a === void 0 ? void 0 : _a.includes(TokenListTag.ASSET_PROXY));
}
function useTotalValueLockedForPlatform(signerOrProvider) {
    return __awaiter(this, void 0, void 0, function () {
        var currency, results, totalValueLocked;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    currency = ts_money_1.Currencies.USD;
                    return [4 /*yield*/, Promise.all(principalTokenInfos.map(function (tokenInfo) { return __awaiter(_this, void 0, void 0, function () {
                            var underlyingContractsByAddress, baseAssetContract, baseAssetPrice;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        underlyingContractsByAddress = (0, getUnderlyingContractsByAddress_1.getUnderlyingContractsByAddress)(chainName, signerOrProvider);
                                        baseAssetContract = underlyingContractsByAddress[tokenInfo.extensions.underlying];
                                        return [4 /*yield*/, (0, getTokenPrice_1.getTokenPrice)(baseAssetContract, currency)];
                                    case 1:
                                        baseAssetPrice = _a.sent();
                                        return [2 /*return*/, fetchTotalValueLockedForTerm(tokenInfo, baseAssetPrice, signerOrProvider)];
                                }
                            });
                        }); }))];
                case 1:
                    results = _a.sent();
                    totalValueLocked = ts_money_1.Money.fromDecimal(0, currency);
                    results.forEach(function (result) { return (totalValueLocked = totalValueLocked.add(result)); });
                    return [2 /*return*/, totalValueLocked];
            }
        });
    });
}
exports.useTotalValueLockedForPlatform = useTotalValueLockedForPlatform;
function fetchTotalValueLockedForTerm(trancheInfo, baseAssetPrice, signerOrProvider) {
    return __awaiter(this, void 0, void 0, function () {
        var trancheContracts, trancheContractsByAddress, address, decimals, tranche, poolInfo, yieldPoolAddress, yieldPoolInfo, baseAssetLockedBNPromise, accumulatedInterestBNPromise, baseReservesInPrincipalPoolBNPromise, baseReservesInYieldPoolBNPromise, _a, baseAssetLockedBN, accumulatedInterestBN, baseReservesInPrincipalPoolBN, baseReservesInYieldPoolBN, baseAssetLocked, accumulatedInterest, baseReservesInPrincipalPool, baseReservesInYieldPool, totalFiatValueLocked;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    trancheContracts = principalTokenInfos.map(function (_a) {
                        var address = _a.address;
                        return Tranche__factory_1.Tranche__factory.connect(address, signerOrProvider);
                    });
                    trancheContractsByAddress = (0, keyby_1.default)(trancheContracts, function (tranche) { return tranche.address; });
                    address = trancheInfo.address, decimals = trancheInfo.decimals;
                    tranche = trancheContractsByAddress[address];
                    poolInfo = getPoolInfoForPrincipalToken(address);
                    yieldPoolAddress = getPoolForYieldToken(trancheInfo.extensions.interestToken, signerOrProvider).address;
                    yieldPoolInfo = getTokenInfo(yieldPoolAddress);
                    baseAssetLockedBNPromise = tranche.valueSupplied();
                    accumulatedInterestBNPromise = fetchAccumulatedInterestForTranche(poolInfo, signerOrProvider);
                    baseReservesInPrincipalPoolBNPromise = fetchBaseAssetReservesInPool(poolInfo, signerOrProvider);
                    baseReservesInYieldPoolBNPromise = fetchBaseAssetReservesInPool(yieldPoolInfo, signerOrProvider);
                    return [4 /*yield*/, Promise.all([
                            baseAssetLockedBNPromise,
                            accumulatedInterestBNPromise,
                            baseReservesInPrincipalPoolBNPromise,
                            baseReservesInYieldPoolBNPromise,
                        ])];
                case 1:
                    _a = _b.sent(), baseAssetLockedBN = _a[0], accumulatedInterestBN = _a[1], baseReservesInPrincipalPoolBN = _a[2], baseReservesInYieldPoolBN = _a[3];
                    baseAssetLocked = +(0, utils_1.formatUnits)(baseAssetLockedBN || 0, decimals);
                    accumulatedInterest = +(0, utils_1.formatUnits)(accumulatedInterestBN || 0, decimals);
                    baseReservesInPrincipalPool = +(0, utils_1.formatUnits)(baseReservesInPrincipalPoolBN || 0, decimals);
                    baseReservesInYieldPool = +(0, utils_1.formatUnits)(baseReservesInYieldPoolBN || 0, decimals);
                    totalFiatValueLocked = baseAssetPrice.multiply(baseAssetLocked +
                        accumulatedInterest +
                        baseReservesInPrincipalPool +
                        baseReservesInYieldPool, Math.round);
                    return [2 /*return*/, totalFiatValueLocked];
            }
        });
    });
}
exports.fetchTotalValueLockedForTerm = fetchTotalValueLockedForTerm;
function fetchAccumulatedInterestForTranche(poolInfo, signerOrProvider) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, trancheAddress, vaultAssetProxyAddress, trancheContracts, trancheContractsByAddress, trancheContract, assetProxyContracts, assetProxyContractsByAddress, yVaultAssetProxy, balanceOfUnderlying, valueOfSharesInUnderlying;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = getPrincipalTokenInfoForPool(poolInfo), trancheAddress = _a.address, vaultAssetProxyAddress = _a.extensions.position;
                    trancheContracts = principalTokenInfos.map(function (_a) {
                        var address = _a.address;
                        return Tranche__factory_1.Tranche__factory.connect(address, signerOrProvider);
                    });
                    trancheContractsByAddress = (0, keyby_1.default)(trancheContracts, function (tranche) { return tranche.address; });
                    trancheContract = trancheContractsByAddress[trancheAddress];
                    assetProxyContracts = assetProxyTokenInfos.map(function (_a) {
                        var address = _a.address;
                        return YVaultAssetProxy__factory_1.YVaultAssetProxy__factory.connect(address, signerOrProvider);
                    });
                    assetProxyContractsByAddress = (0, keyby_1.default)(assetProxyContracts, function (position) { return position.address; });
                    yVaultAssetProxy = assetProxyContractsByAddress[vaultAssetProxyAddress];
                    return [4 /*yield*/, trancheContract.valueSupplied()];
                case 1:
                    balanceOfUnderlying = _b.sent();
                    return [4 /*yield*/, yVaultAssetProxy.balanceOfUnderlying(trancheAddress)];
                case 2:
                    valueOfSharesInUnderlying = _b.sent();
                    return [2 /*return*/, valueOfSharesInUnderlying.sub(balanceOfUnderlying)];
            }
        });
    });
}
exports.fetchAccumulatedInterestForTranche = fetchAccumulatedInterestForTranche;
function getPrincipalTokenInfoForPool(poolInfo) {
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
function fetchBaseAssetReservesInPool(poolInfo, signerOrProvider) {
    return __awaiter(this, void 0, void 0, function () {
        var balancerVaultContract, _a, balances, baseAssetIndex;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    balancerVaultContract = Vault__factory_1.Vault__factory.connect(exports.AddressesJson.addresses.balancerVaultAddress, signerOrProvider);
                    return [4 /*yield*/, balancerVaultContract.getPoolTokens(poolInfo.extensions.poolId)];
                case 1:
                    _a = _b.sent(), balances = _a[1];
                    baseAssetIndex = getPoolTokens(poolInfo, signerOrProvider).baseAssetIndex;
                    return [2 /*return*/, balances === null || balances === void 0 ? void 0 : balances[baseAssetIndex]];
            }
        });
    });
}
exports.fetchBaseAssetReservesInPool = fetchBaseAssetReservesInPool;
function getPoolTokens(poolInfo, signerOrProvider) {
    var _a, _b, _c, _d, _e;
    var baseAssetAddress = poolInfo === null || poolInfo === void 0 ? void 0 : poolInfo.extensions.underlying;
    var termAssetAddress = (_c = (_b = (_a = poolInfo) === null || _a === void 0 ? void 0 : _a.extensions) === null || _b === void 0 ? void 0 : _b.bond) !== null && _c !== void 0 ? _c : (_e = (_d = poolInfo) === null || _d === void 0 ? void 0 : _d.extensions) === null || _e === void 0 ? void 0 : _e.interestToken;
    var baseAssetInfo = getTokenInfo(baseAssetAddress);
    var termAssetInfo = getTokenInfo(termAssetAddress);
    var underlyingContractsByAddress = (0, getUnderlyingContractsByAddress_1.getUnderlyingContractsByAddress)(chainName, signerOrProvider);
    var baseAssetContract = underlyingContractsByAddress[baseAssetAddress];
    var termAssetContract = getSmartContractFromRegistry(termAssetAddress, ERC20__factory_1.ERC20__factory.connect, signerOrProvider);
    var sortedAddresses = sortAddresses([
        baseAssetAddress,
        termAssetAddress,
    ]);
    var baseAssetIndex = sortedAddresses.findIndex(function (address) { return address === baseAssetAddress; });
    var termAssetIndex = sortedAddresses.findIndex(function (address) { return address === termAssetAddress; });
    return {
        baseAssetInfo: baseAssetInfo,
        baseAssetContract: baseAssetContract,
        baseAssetIndex: baseAssetIndex,
        termAssetInfo: termAssetInfo,
        termAssetContract: termAssetContract,
        termAssetIndex: termAssetIndex,
        sortedAddresses: sortedAddresses,
    };
}
exports.getPoolTokens = getPoolTokens;
function sortAddresses(addresses) {
    var lowerCaseAddresses = addresses.map(function (address) { return address.toLowerCase(); });
    // map of lower case addresses to mixed case addresses
    var addressMap = {};
    lowerCaseAddresses.forEach(function (lowerCaseAddress, index) {
        addressMap[lowerCaseAddress] = addresses[index];
    });
    var sortedLowerCaseAddresses = lowerCaseAddresses.map(function (a) { return a; }).sort();
    var sortedAddresses = sortedLowerCaseAddresses.map(function (lowerCaseAddress) { return addressMap[lowerCaseAddress]; });
    return sortedAddresses;
}
// Do not export this from this file
var SMART_CONTRACTS_REGISTRY = {};
function getSmartContractFromRegistry(address, factoryConnect, signerOrProvider) {
    if (!address) {
        return undefined;
    }
    // Pull from cache if we have the instance already
    var cachedContract = SMART_CONTRACTS_REGISTRY[address];
    if (cachedContract) {
        return cachedContract;
    }
    // Otherwise populate cache and return it
    SMART_CONTRACTS_REGISTRY[address] = factoryConnect(address, signerOrProvider);
    return SMART_CONTRACTS_REGISTRY[address];
}
