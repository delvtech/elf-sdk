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
import { useTotalValueLockedForPlatform, principalTokenInfos, fetchTotalValueLockedForTerm } from "../src/helpers/calcTvl"

import { Currencies, Money } from "ts-money";
import { ERC20 } from "elf-contracts-typechain/dist/types/ERC20";
import { getUnderlyingContractsByAddress }  from "../src/helpers/getUnderlyingContractsByAddress";
import { getTokenPrice } from "../src/helpers/getTokenPrice"

async function main() {
    const [signer] = await ethers.getSigners();
    const tvl = await useTotalValueLockedForPlatform(signer);
    console.log(tvl);

    const chainName = "mainnet";
    const currency = Currencies.USD;
    const results = await Promise.all(
        principalTokenInfos.map(async (tokenInfo) => {
            const underlyingContractsByAddress = getUnderlyingContractsByAddress(chainName, signer);
            const baseAssetContract =
            underlyingContractsByAddress[tokenInfo.extensions.underlying];
            const baseAssetPrice = await getTokenPrice(
            baseAssetContract as ERC20,
            currency
            );
            const termTvl = await fetchTotalValueLockedForTerm(tokenInfo, baseAssetPrice, signer);
            return [await (baseAssetContract as ERC20).name(), termTvl];
        })
    );

  results.forEach(
    (result) => {
        console.log(result[0]);
        console.log(result[1]);
    }
  );
}

main();
