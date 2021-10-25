"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenPrice = void 0;
var ts_money_1 = require("ts-money");
function getTokenPrice(contract, currency) {
    return new Promise(function (resolve) {
        return resolve(ts_money_1.Money.fromDecimal(0.01, currency, Math.round));
    });
}
exports.getTokenPrice = getTokenPrice;
