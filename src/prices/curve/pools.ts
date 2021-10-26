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
import { CurveContract__factory } from "elf-contracts-typechain/dist/types/factories/CurveContract__factory";
import { CurveStethPool__factory } from "elf-contracts-typechain/dist/types/factories/CurveStethPool__factory";
import {
  CurveStethPool,
  CurveContract,
} from "elf-contracts-typechain/dist/types";
import { CRVLUSD__factory } from "elf-contracts-typechain/dist/types/factories/CRVLUSD__factory";
import { CRVLUSD } from "elf-contracts-typechain/dist/types/CRVLUSD";

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
export function getCrvTriCryptoPoolContract(
  signerOrProvider: Signer | Provider
): CurveContract {
  const CRVTriCrytoPoolAddress = "0x80466c64868e1ab14a1ddf27a676c3fcbe638fe5";
  const crvTriCryptoPoolContract = CurveContract__factory.connect(
    CRVTriCrytoPoolAddress,
    signerOrProvider
  );
  return crvTriCryptoPoolContract;
}

export function getCrv3CryptoPoolContract(
  signerOrProvider: Signer | Provider
): CurveContract {
  const CRV3CrytoPoolAddress = "0xD51a44d3FaE010294C616388b506AcdA1bfAAE46";
  const crv3CryptoPoolContract = CurveContract__factory.connect(
    CRV3CrytoPoolAddress,
    signerOrProvider
  );
  return crv3CryptoPoolContract;
}

export function getSteCrvPoolContract(
  signerOrProvider: Signer | Provider
): CurveStethPool {
  const steCRVPoolAddress = "0xDC24316b9AE028F1497c275EB9192a3Ea0f67022";
  const steCrvPoolContract = CurveStethPool__factory.connect(
    steCRVPoolAddress,
    signerOrProvider
  );
  return steCrvPoolContract;
}
