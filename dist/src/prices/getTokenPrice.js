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
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatBalance = exports.getTokenPrice = exports.ONE_ETHER = exports.NUM_ETH_DECIMALS = void 0;
var ts_money_1 = require("ts-money");
var utils_1 = require("ethers/lib/utils");
var coingecko_1 = require("./coingecko");
var pools_1 = require("./curve/pools");
var stablePools_1 = require("./curve/stablePools");
var getTokenInfo_1 = require("../helpers/getTokenInfo");
exports.NUM_ETH_DECIMALS = 18;
exports.ONE_ETHER = (0, utils_1.parseUnits)("1", exports.NUM_ETH_DECIMALS);
function getTokenPrice(chainName, contract, currency, signerOrProvider) {
    var result = (0, getTokenInfo_1.initTokenList)(chainName);
    var _a = (0, getTokenInfo_1.getTokenInfo)(contract.address, result.tokenInfoByAddress), tokenSymbol = _a.symbol, decimals = _a.decimals;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    var AddressesJson = require("elf-tokenlist/dist/" + chainName + ".addresses.json");
    var _b = AddressesJson.addresses, crvtricryptoAddress = _b.crvtricryptoAddress, stecrvAddress = _b.stecrvAddress, crv3cryptoAddress = _b.crv3cryptoAddress;
    // Curve stable pools, eg: crvLUSD
    var isStablePool = (0, stablePools_1.isCurveStablePool)(chainName, contract.address);
    // Individual Curve non-stable pools, eg crvTricrypto or steCRV
    var isCrvTricrypto = contract.address === crvtricryptoAddress;
    var isSteCrv = contract.address === stecrvAddress;
    var isCrv3crypto = contract.address === crv3cryptoAddress;
    if (isStablePool) {
        var curveVirtualPriceContractsByAddress = (0, stablePools_1.getCurveStablePoolContractsByAddress)(chainName, signerOrProvider);
        var curveStablePoolContract = curveVirtualPriceContractsByAddress[contract.address];
        var curveStablePoolPriceResult = fetchCurveStablecoinPoolVirtualPrice(curveStablePoolContract, decimals, currency, signerOrProvider);
        return curveStablePoolPriceResult;
    }
    if (isCrvTricrypto) {
        var triCryptoPriceResult = fetchTriCryptoPrice(currency, signerOrProvider);
        return triCryptoPriceResult;
    }
    if (isCrv3crypto) {
        var crv3CryptoPriceResult = fetch3CryptoPrice(currency, signerOrProvider);
        return crv3CryptoPriceResult;
    }
    if (isSteCrv) {
        var steCrvPriceResult = fetchSteCrvPrice(currency, signerOrProvider);
        return steCrvPriceResult;
    }
    // Regular base assets
    var coinGeckoPricePromise = (0, coingecko_1.fetchCoinGeckoPrice)((0, coingecko_1.getCoinGeckoId)(tokenSymbol), currency);
    return coinGeckoPricePromise;
}
exports.getTokenPrice = getTokenPrice;
function fetchCurveStablecoinPoolVirtualPrice(stablePoolContract, decimals, currency, signerOrProvider) {
    return __awaiter(this, void 0, void 0, function () {
        var virtualPriceBigNumber, price;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, stablePoolContract.get_virtual_price()];
                case 1:
                    virtualPriceBigNumber = _a.sent();
                    price = +formatBalance(virtualPriceBigNumber, decimals);
                    return [2 /*return*/, ts_money_1.Money.fromDecimal(price, currency, Math.round)];
            }
        });
    });
}
var ETHER_INDEX_FOR_CRVTRICRYPTO = 0;
function fetch3CryptoPrice(currency, signerOrProvider) {
    return __awaiter(this, void 0, void 0, function () {
        var usdtPrice, crv3CryptoPriceInUSDT, price;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, coingecko_1.fetchCoinGeckoPrice)((0, coingecko_1.getCoinGeckoId)("usdt"), currency)];
                case 1:
                    usdtPrice = _a.sent();
                    return [4 /*yield*/, (0, pools_1.getCrv3CryptoPoolContract)(signerOrProvider).calc_withdraw_one_coin(exports.ONE_ETHER, ETHER_INDEX_FOR_CRVTRICRYPTO)];
                case 2:
                    crv3CryptoPriceInUSDT = _a.sent();
                    price = +(0, utils_1.formatUnits)(crv3CryptoPriceInUSDT, 6) / +usdtPrice.toString();
                    return [2 /*return*/, ts_money_1.Money.fromDecimal(price, currency, Math.round)];
            }
        });
    });
}
function fetchTriCryptoPrice(currency, signerOrProvider) {
    return __awaiter(this, void 0, void 0, function () {
        var usdtPrice, triCryptoPriceInUSDT, price;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, coingecko_1.fetchCoinGeckoPrice)((0, coingecko_1.getCoinGeckoId)("usdt"), currency)];
                case 1:
                    usdtPrice = _a.sent();
                    return [4 /*yield*/, (0, pools_1.getCrvTriCryptoPoolContract)(signerOrProvider).calc_withdraw_one_coin(exports.ONE_ETHER, ETHER_INDEX_FOR_CRVTRICRYPTO)];
                case 2:
                    triCryptoPriceInUSDT = _a.sent();
                    price = +(0, utils_1.formatUnits)(triCryptoPriceInUSDT, 6) / +usdtPrice.toString();
                    return [2 /*return*/, ts_money_1.Money.fromDecimal(price, currency, Math.round)];
            }
        });
    });
}
var ETHER_INDEX_FOR_STECRV = 0;
function fetchSteCrvPrice(currency, signerOrProvider) {
    return __awaiter(this, void 0, void 0, function () {
        var ethPrice, steCrvPriceInEth, price;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, coingecko_1.fetchCoinGeckoPrice)((0, coingecko_1.getCoinGeckoId)("eth"), currency)];
                case 1:
                    ethPrice = _a.sent();
                    return [4 /*yield*/, (0, pools_1.getSteCrvPoolContract)(signerOrProvider).calc_withdraw_one_coin(exports.ONE_ETHER, ETHER_INDEX_FOR_STECRV)];
                case 2:
                    steCrvPriceInEth = _a.sent();
                    price = +(0, utils_1.formatUnits)(steCrvPriceInEth, exports.NUM_ETH_DECIMALS) *
                        +ethPrice.toString();
                    return [2 /*return*/, ts_money_1.Money.fromDecimal(price, currency.code, Math.round)];
            }
        });
    });
}
var defaultOptions = { formatCommas: true };
function formatBalance(balance, decimals, options) {
    if (options === void 0) { options = defaultOptions; }
    if (!balance || !decimals) {
        return "0.0000";
    }
    var stringBalance = (0, utils_1.formatUnits)(balance, decimals);
    var formatCommas = options.formatCommas;
    if (formatCommas) {
        return (0, utils_1.commify)(stringBalance);
    }
    return stringBalance;
}
exports.formatBalance = formatBalance;
