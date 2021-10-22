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

import { Provider } from "@ethersproject/providers";
import { Signer } from "ethers";

import {
  DAI__factory,
  ERC20__factory,
  ERC20Permit__factory,
  ERC20,
  ERC20Permit,
  WETH,
  DAI,
} from "elf-contracts-typechain/dist/types";
import { WETH__factory } from "elf-contracts-typechain/dist/types/factories/WETH__factory";
import { AddressesJsonFile } from "elf-tokenlist/dist/AddressesJsonFile";

/**
 * This method creates a token to contract mapping
 * @param addressesJsonId mainnet or goerli
 * @param signerOrProvider
 * @returns a mapping of token addresses to corresponding pool contracts
 */
export function getUnderlyingContractsByAddress(
  addressesJsonId: string,
  signerOrProvider: Signer | Provider
): Record<string, ERC20 | WETH | DAI | ERC20Permit> {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const AddressesJson: AddressesJsonFile = require(`elf-tokenlist/dist/${addressesJsonId}.addresses.json`);
  const {
    addresses: {
      wethAddress,
      wbtcAddress,
      usdcAddress,
      daiAddress,
      "alusd3crv-fAddress": crvalusdAddress,
      "mim-3lp3crv-fAddress": crvmimAddress,
      "lusd3crv-fAddress": crvlusdAddress,
      crv3cryptoAddress,
      crvtricryptoAddress,
      stecrvAddress,
      eurscrvAddress,
    },
  } = AddressesJson;

  const wethContract = WETH__factory.connect(wethAddress, signerOrProvider);
  const wbtcContract = ERC20__factory.connect(wbtcAddress, signerOrProvider);
  const usdcContract = ERC20Permit__factory.connect(
    usdcAddress,
    signerOrProvider
  );
  const daiContract = DAI__factory.connect(daiAddress, signerOrProvider);
  const crvlusdContract = ERC20__factory.connect(
    crvlusdAddress,
    signerOrProvider
  );
  const crvalusdContract = ERC20__factory.connect(
    crvalusdAddress,
    signerOrProvider
  );
  const crvmimContract = ERC20__factory.connect(
    crvmimAddress,
    signerOrProvider
  );

  const crvTricryptoContract = ERC20__factory.connect(
    crvtricryptoAddress,
    signerOrProvider
  );
  const crv3CryptoContract = ERC20__factory.connect(
    crv3cryptoAddress,
    signerOrProvider
  );

  const steCrvContract = ERC20__factory.connect(
    stecrvAddress,
    signerOrProvider
  );
  const eursCrvContract = ERC20__factory.connect(
    eurscrvAddress,
    signerOrProvider
  );

  const underlyingContractsByAddress = Object.freeze({
    [wethAddress]: wethContract,
    [wbtcAddress]: wbtcContract,
    [usdcAddress]: usdcContract,
    [daiAddress]: daiContract,
    [crvlusdAddress]: crvlusdContract,
    [crvalusdAddress]: crvalusdContract,
    [crvtricryptoAddress]: crvTricryptoContract,
    [crv3cryptoAddress]: crv3CryptoContract,
    [crvmimAddress]: crvmimContract,
    [stecrvAddress]: steCrvContract,
    [eurscrvAddress]: eursCrvContract,
  });
  return underlyingContractsByAddress;
}
