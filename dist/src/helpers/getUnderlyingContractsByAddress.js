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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUnderlyingContractsByAddress = void 0;
var types_1 = require("elf-contracts-typechain/dist/types");
var WETH__factory_1 = require("elf-contracts-typechain/dist/types/factories/WETH__factory");
/**
 * This method creates a token to contract mapping
 * @param addressesJsonId mainnet or goerli
 * @param signerOrProvider
 * @returns a mapping of token addresses to corresponding pool contracts
 */
function getUnderlyingContractsByAddress(addressesJsonId, signerOrProvider) {
    var _a;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    var AddressesJson = require("elf-tokenlist/dist/" + addressesJsonId + ".addresses.json");
    var _b = AddressesJson.addresses, wethAddress = _b.wethAddress, wbtcAddress = _b.wbtcAddress, usdcAddress = _b.usdcAddress, daiAddress = _b.daiAddress, crvalusdAddress = _b["alusd3crv-fAddress"], crvmimAddress = _b["mim-3lp3crv-fAddress"], crvlusdAddress = _b["lusd3crv-fAddress"], crv3cryptoAddress = _b.crv3cryptoAddress, crvtricryptoAddress = _b.crvtricryptoAddress, stecrvAddress = _b.stecrvAddress, eurscrvAddress = _b.eurscrvAddress;
    var wethContract = WETH__factory_1.WETH__factory.connect(wethAddress, signerOrProvider);
    var wbtcContract = types_1.ERC20__factory.connect(wbtcAddress, signerOrProvider);
    var usdcContract = types_1.ERC20Permit__factory.connect(usdcAddress, signerOrProvider);
    var daiContract = types_1.DAI__factory.connect(daiAddress, signerOrProvider);
    var crvlusdContract = types_1.ERC20__factory.connect(crvlusdAddress, signerOrProvider);
    var crvalusdContract = types_1.ERC20__factory.connect(crvalusdAddress, signerOrProvider);
    var crvmimContract = types_1.ERC20__factory.connect(crvmimAddress, signerOrProvider);
    var crvTricryptoContract = types_1.ERC20__factory.connect(crvtricryptoAddress, signerOrProvider);
    var crv3CryptoContract = types_1.ERC20__factory.connect(crv3cryptoAddress, signerOrProvider);
    var steCrvContract = types_1.ERC20__factory.connect(stecrvAddress, signerOrProvider);
    var eursCrvContract = types_1.ERC20__factory.connect(eurscrvAddress, signerOrProvider);
    var underlyingContractsByAddress = Object.freeze((_a = {},
        _a[wethAddress] = wethContract,
        _a[wbtcAddress] = wbtcContract,
        _a[usdcAddress] = usdcContract,
        _a[daiAddress] = daiContract,
        _a[crvlusdAddress] = crvlusdContract,
        _a[crvalusdAddress] = crvalusdContract,
        _a[crvtricryptoAddress] = crvTricryptoContract,
        _a[crv3cryptoAddress] = crv3CryptoContract,
        _a[crvmimAddress] = crvmimContract,
        _a[stecrvAddress] = steCrvContract,
        _a[eurscrvAddress] = eursCrvContract,
        _a));
    return underlyingContractsByAddress;
}
exports.getUnderlyingContractsByAddress = getUnderlyingContractsByAddress;
