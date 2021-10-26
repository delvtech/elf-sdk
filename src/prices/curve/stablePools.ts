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
import { Signer, BigNumber } from "ethers";
import { CRVLUSD__factory } from "elf-contracts-typechain/dist/types/factories/CRVLUSD__factory";
import { CRVLUSD } from "elf-contracts-typechain/dist/types/CRVLUSD";
import { AddressesJsonFile } from "elf-tokenlist/dist/AddressesJsonFile";

export function getCurveStablePoolContractsByAddress(
  chainName: string,
  signerOrProvider: Signer | Provider
): Record<string, CRVLUSD> {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const AddressesJson: AddressesJsonFile = require(`elf-tokenlist/dist/${chainName}.addresses.json`);
  /**
   * Curve stable pools provide a `get_virtual_price` method for getting the price.
   */
  const {
    addresses: {
      eurscrvAddress,
      "alusd3crv-fAddress": crvalusdAddress,
      "lusd3crv-fAddress": crvlusdAddress,
      "mim-3lp3crv-fAddress": crvmimAddress,
    },
  } = AddressesJson;

  const crvalusdContract = CRVLUSD__factory.connect(
    // Note: the CRVLUSD_factory is the same, so it can handle both alusd and lusd pools.
    crvalusdAddress,
    signerOrProvider
  );

  const crvlusdContract = CRVLUSD__factory.connect(
    crvlusdAddress,
    signerOrProvider
  );

  const crvMimContract = CRVLUSD__factory.connect(
    crvmimAddress,
    signerOrProvider
  );

  const CRVEursPoolAddress = "0x0Ce6a5fF5217e38315f87032CF90686C96627CAA";
  const crvEursPoolContract = CRVLUSD__factory.connect(
    CRVEursPoolAddress,
    signerOrProvider
  );

  const curveVirtualPriceContractsByAddress = Object.freeze({
    [eurscrvAddress]: crvEursPoolContract,
    [crvalusdAddress]: crvalusdContract,
    [crvlusdAddress]: crvlusdContract,
    [crvmimAddress]: crvMimContract,
  });
  return curveVirtualPriceContractsByAddress;
}

export function isCurveStablePool(chainName: string, address: string): boolean {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const AddressesJson: AddressesJsonFile = require(`elf-tokenlist/dist/${chainName}.addresses.json`);
  /**
   * Curve stable pools provide a `get_virtual_price` method for getting the price.
   */
  const {
    addresses: {
      eurscrvAddress,
      "alusd3crv-fAddress": crvalusdAddress,
      "lusd3crv-fAddress": crvlusdAddress,
      "mim-3lp3crv-fAddress": crvmimAddress,
    },
  } = AddressesJson;
  return [
    eurscrvAddress,
    crvalusdAddress,
    crvlusdAddress,
    crvmimAddress,
  ].includes(address);
}
