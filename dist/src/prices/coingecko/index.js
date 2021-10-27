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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.fetchCoinGeckoHistoricalPrice = exports.fetchCoinGeckoPrice = exports.getCoinGeckoId = void 0;
var ts_money_1 = require("ts-money");
var axios_1 = __importDefault(require("axios"));
var date_fns_1 = require("date-fns");
var coins_json_1 = __importDefault(require("./coins.json"));
/**
 * Lookup object for getting the CoinGecko coin id from the coin or token's
 * symbol.
 *
 *  Eg:
 *  CoinGeckoIds.eth === 'ethereum' // true
 *
 * This can then be used to make calls to CoinGecko apis about ethereum, ie: price apis.
 *
 * TODO: This can be auto-generated instead of created at runtime.
 */
var CoinGeckoIds = coins_json_1.default.reduce(function (memo, value) {
    var _a;
    return (__assign(__assign({}, memo), (_a = {}, _a[value.symbol] = value.id, _a)));
}, {});
function getCoinGeckoId(symbol) {
    if (!symbol) {
        return;
    }
    return CoinGeckoIds[symbol.toLowerCase()];
}
exports.getCoinGeckoId = getCoinGeckoId;
function fetchCoinGeckoPrice(coinGeckoId, currency) {
    return __awaiter(this, void 0, void 0, function () {
        var currencyCode, result, resultJSON, price;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    currencyCode = currency.code.toLowerCase();
                    return [4 /*yield*/, (0, axios_1.default)("https://api.coingecko.com/api/v3/simple/price?ids=" + coinGeckoId + "&vs_currencies=" + currencyCode)];
                case 1:
                    result = _a.sent();
                    resultJSON = result.data;
                    price = resultJSON[coinGeckoId][currencyCode];
                    return [2 /*return*/, ts_money_1.Money.fromDecimal(price, currency, 
                        // Money.fromDecimal will throw if price has more decimals than the currency
                        // allows unless you pass a rounding function
                        Math.round)];
            }
        });
    });
}
exports.fetchCoinGeckoPrice = fetchCoinGeckoPrice;
function fetchCoinGeckoHistoricalPrice(coinGeckoId, currency, daysAgo) {
    if (daysAgo === void 0) { daysAgo = 1; }
    return __awaiter(this, void 0, void 0, function () {
        var dateString, currencyCode, result, resultJSON, price;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dateString = (0, date_fns_1.format)((0, date_fns_1.subDays)(new Date(), daysAgo), "dd-MM-yyyy");
                    currencyCode = currency.code.toLowerCase();
                    return [4 /*yield*/, (0, axios_1.default)("https://api.coingecko.com/api/v3/coins/" + coinGeckoId + "/history?date=" + dateString)];
                case 1:
                    result = _a.sent();
                    return [4 /*yield*/, result.data];
                case 2:
                    resultJSON = (_a.sent());
                    price = resultJSON["market_data"]["current_price"][currencyCode];
                    return [2 /*return*/, ts_money_1.Money.fromDecimal(price, currency, 
                        // Money.fromDecimal will throw if price has more decimals than the currency
                        // allows unless you pass a rounding function
                        Math.round)];
            }
        });
    });
}
exports.fetchCoinGeckoHistoricalPrice = fetchCoinGeckoHistoricalPrice;
