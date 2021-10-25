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

import { TokenInfo, TokenList } from "@uniswap/token-lists";
import keyBy from "lodash.keyby";
import {
  PrincipalTokenInfo,
  YieldPoolTokenInfo,
  PrincipalPoolTokenInfo,
  AssetProxyTokenInfo,
  AnyTokenListInfo,
  TokenTag,
} from "elf-tokenlist";
import { AddressesJsonFile } from "elf-tokenlist/dist/AddressesJsonFile";

interface InitTokenListResult {
  tokenList: TokenList;
  addressesJson: AddressesJsonFile;
  tokenInfoByAddress: Record<string, AnyTokenListInfo>;
}

/**
 * Init the tokenlist for given chain
 * @param chainName name of the chain that the tokenlist represents
 * @returns InitTokenListResult
 */
export function initTokenList(chainName: string): InitTokenListResult {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const tokenList: TokenList = require(`elf-tokenlist/dist/${chainName}.tokenlist.json`);
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const addressesJson: AddressesJsonFile = require(`elf-tokenlist/dist/${chainName}.addresses.json`);
  const tokenInfos = tokenList.tokens;
  const tokenInfoByAddress: Record<string, AnyTokenListInfo> = keyBy(
    tokenInfos,
    "address"
  );
  return { tokenList, addressesJson, tokenInfoByAddress };
}

/**
 * Helper function for looking up a tokenlist info
 * @param address address of the token
 * @param tokenInfoByAddress mapping of TokenInfos by address
 * @returns Mapping of TokenInfos by address
 */
export function getTokenInfo<T extends TokenInfo>(
  address: string,
  tokenInfoByAddress: Record<string, AnyTokenListInfo>
): T {
  return tokenInfoByAddress[address] as T;
}

function isAssetProxy(tokenInfo: TokenInfo): tokenInfo is PrincipalTokenInfo {
  return !!tokenInfo.tags?.includes(TokenTag.ASSET_PROXY);
}

export function getAssetProxyTokenInfos(
  tokenInfos: TokenInfo[]
): AssetProxyTokenInfo[] {
  return tokenInfos.filter((tokenInfo): tokenInfo is AssetProxyTokenInfo =>
    isAssetProxy(tokenInfo)
  );
}

function isPrincipalToken(
  tokenInfo: TokenInfo
): tokenInfo is PrincipalTokenInfo {
  return !!tokenInfo?.tags?.includes(TokenTag.PRINCIPAL);
}

export function getPrincipalTokenInfos(
  tokenInfos: TokenInfo[]
): PrincipalTokenInfo[] {
  return tokenInfos.filter((tokenInfo): tokenInfo is PrincipalTokenInfo =>
    isPrincipalToken(tokenInfo)
  );
}

function isPrincipalPool(
  tokenInfo: TokenInfo
): tokenInfo is PrincipalPoolTokenInfo {
  return !!tokenInfo.tags?.includes(TokenTag.CCPOOL);
}

export function getPrincipalTokenInfoForPool(
  poolInfo: YieldPoolTokenInfo | PrincipalPoolTokenInfo,
  tokenInfos: TokenInfo[]
): PrincipalTokenInfo {
  const principalTokenInfos = getPrincipalTokenInfos(tokenInfos);
  if (isPrincipalPool(poolInfo)) {
    const trancheAddress = poolInfo.extensions.bond;
    const trancheInfo = principalTokenInfos.find(
      (info) => info.address === trancheAddress
    ) as PrincipalTokenInfo;
    return trancheInfo;
  }

  const interestTokenAddress = poolInfo.extensions.interestToken;
  const trancheInfo = principalTokenInfos.find(
    (info) => info.extensions.interestToken === interestTokenAddress
  ) as PrincipalTokenInfo;
  return trancheInfo;
}

export function getPoolInfoForPrincipalToken(
  principalTokenAddress: string,
  tokenInfos: TokenInfo[]
): PrincipalPoolTokenInfo {
  const principalPools: PrincipalPoolTokenInfo[] = tokenInfos.filter(
    (tokenInfo): tokenInfo is PrincipalPoolTokenInfo =>
      isPrincipalPool(tokenInfo)
  );
  return principalPools.find(
    ({ extensions: { bond } }) => bond === principalTokenAddress
  ) as PrincipalPoolTokenInfo;
}

function isYieldPool(tokenInfo: TokenInfo): tokenInfo is YieldPoolTokenInfo {
  return !!tokenInfo.tags?.includes(TokenTag.WPOOL);
}

export function getYieldPoolTokenInfos(
  tokenInfos: TokenInfo[]
): YieldPoolTokenInfo[] {
  return tokenInfos.filter((tokenInfo): tokenInfo is YieldPoolTokenInfo =>
    isYieldPool(tokenInfo)
  );
}
