"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCurveStablePool = exports.getCurveStablePoolContractsByAddress = void 0;
var CRVLUSD__factory_1 = require("elf-contracts-typechain/dist/types/factories/CRVLUSD__factory");
function getCurveStablePoolContractsByAddress(chainName, signerOrProvider) {
    var _a;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    var AddressesJson = require("elf-tokenlist/dist/" + chainName + ".addresses.json");
    /**
     * Curve stable pools provide a `get_virtual_price` method for getting the price.
     */
    var _b = AddressesJson.addresses, eurscrvAddress = _b.eurscrvAddress, crvalusdAddress = _b["alusd3crv-fAddress"], crvlusdAddress = _b["lusd3crv-fAddress"], crvmimAddress = _b["mim-3lp3crv-fAddress"];
    var crvalusdContract = CRVLUSD__factory_1.CRVLUSD__factory.connect(
    // Note: the CRVLUSD_factory is the same, so it can handle both alusd and lusd pools.
    crvalusdAddress, signerOrProvider);
    var crvlusdContract = CRVLUSD__factory_1.CRVLUSD__factory.connect(crvlusdAddress, signerOrProvider);
    var crvMimContract = CRVLUSD__factory_1.CRVLUSD__factory.connect(crvmimAddress, signerOrProvider);
    var CRVEursPoolAddress = "0x0Ce6a5fF5217e38315f87032CF90686C96627CAA";
    var crvEursPoolContract = CRVLUSD__factory_1.CRVLUSD__factory.connect(CRVEursPoolAddress, signerOrProvider);
    var curveVirtualPriceContractsByAddress = Object.freeze((_a = {},
        _a[eurscrvAddress] = crvEursPoolContract,
        _a[crvalusdAddress] = crvalusdContract,
        _a[crvlusdAddress] = crvlusdContract,
        _a[crvmimAddress] = crvMimContract,
        _a));
    return curveVirtualPriceContractsByAddress;
}
exports.getCurveStablePoolContractsByAddress = getCurveStablePoolContractsByAddress;
function isCurveStablePool(chainName, address) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    var AddressesJson = require("elf-tokenlist/dist/" + chainName + ".addresses.json");
    /**
     * Curve stable pools provide a `get_virtual_price` method for getting the price.
     */
    var _a = AddressesJson.addresses, eurscrvAddress = _a.eurscrvAddress, crvalusdAddress = _a["alusd3crv-fAddress"], crvlusdAddress = _a["lusd3crv-fAddress"], crvmimAddress = _a["mim-3lp3crv-fAddress"];
    return [
        eurscrvAddress,
        crvalusdAddress,
        crvlusdAddress,
        crvmimAddress,
    ].includes(address);
}
exports.isCurveStablePool = isCurveStablePool;
