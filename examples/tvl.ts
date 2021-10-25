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

import { ethers } from "hardhat";
import {
  calcTotalValueLocked,
  calcTotalValueLockedForTerm,
} from "../src/helpers/calcTotalValueLocked";
import {
  initTokenList,
  getPrincipalTokenInfos,
  getAssetProxyTokenInfos,
} from "../src/helpers/getTokenInfo";
import { Currencies, Money } from "ts-money";
import { ERC20 } from "elf-contracts-typechain/dist/types/ERC20";
import { getUnderlyingContractsByAddress } from "../src/helpers/getUnderlyingContractsByAddress";
import { getTokenPrice } from "../src/helpers/getTokenPrice";

async function main() {
  const [signer] = await ethers.getSigners();
  const chainName = "mainnet";
  const tvl = await calcTotalValueLocked(chainName, signer);
  console.log(tvl);

  const currency = Currencies.USD;
  const { tokenList, addressesJson, tokenInfoByAddress } =
    initTokenList(chainName);
  const assetProxyTokenInfos = getAssetProxyTokenInfos(tokenList.tokens);
  const principalTokenInfos = getPrincipalTokenInfos(tokenList.tokens);
  const results = await Promise.all(
    principalTokenInfos.map(async (tokenInfo) => {
      const underlyingContractsByAddress = getUnderlyingContractsByAddress(
        chainName,
        signer
      );
      const baseAssetContract =
        underlyingContractsByAddress[tokenInfo.extensions.underlying];
      const baseAssetPrice = await getTokenPrice(
        baseAssetContract as ERC20,
        currency
      );
      const termTvl = await calcTotalValueLockedForTerm(
        tokenInfo,
        addressesJson.addresses.balancerVaultAddress,
        underlyingContractsByAddress,
        assetProxyTokenInfos,
        tokenList.tokens,
        tokenInfoByAddress,
        baseAssetPrice,
        signer
      );
      return [await (baseAssetContract as ERC20).name(), termTvl];
    })
  );

  results.forEach((result) => {
    console.log(result[0]);
    console.log(result[1]);
  });
}

main();
