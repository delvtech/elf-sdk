"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSteCrvPoolContract = exports.getCrv3CryptoPoolContract = exports.getCrvTriCryptoPoolContract = void 0;
var CurveContract__factory_1 = require("elf-contracts-typechain/dist/types/factories/CurveContract__factory");
var CurveStethPool__factory_1 = require("elf-contracts-typechain/dist/types/factories/CurveStethPool__factory");
/*
 * Curve pools that aren't strictly stablecoins are architected such that the LP
 * token (like what is used for minting in Element) is separate from the pool
 * contract that deals with trading and pricing.
 *
 * To price one of these assets, use the `withdraw_one_coin` method to price one
 * of the assets in the pool against an external price sensor, ie: coingecko.
 *
 * NOTE: You can find the pool addresses on curve's website at the bottom of a
 * pool page.
 */
function getCrvTriCryptoPoolContract(signerOrProvider) {
    var CRVTriCrytoPoolAddress = "0x80466c64868e1ab14a1ddf27a676c3fcbe638fe5";
    var crvTriCryptoPoolContract = CurveContract__factory_1.CurveContract__factory.connect(CRVTriCrytoPoolAddress, signerOrProvider);
    return crvTriCryptoPoolContract;
}
exports.getCrvTriCryptoPoolContract = getCrvTriCryptoPoolContract;
function getCrv3CryptoPoolContract(signerOrProvider) {
    var CRV3CrytoPoolAddress = "0xD51a44d3FaE010294C616388b506AcdA1bfAAE46";
    var crv3CryptoPoolContract = CurveContract__factory_1.CurveContract__factory.connect(CRV3CrytoPoolAddress, signerOrProvider);
    return crv3CryptoPoolContract;
}
exports.getCrv3CryptoPoolContract = getCrv3CryptoPoolContract;
function getSteCrvPoolContract(signerOrProvider) {
    var steCRVPoolAddress = "0xDC24316b9AE028F1497c275EB9192a3Ea0f67022";
    var steCrvPoolContract = CurveStethPool__factory_1.CurveStethPool__factory.connect(steCRVPoolAddress, signerOrProvider);
    return steCrvPoolContract;
}
exports.getSteCrvPoolContract = getSteCrvPoolContract;
