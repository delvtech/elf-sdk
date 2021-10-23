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
import keyBy from "lodash/keyby";
import { AnyTokenListInfo } from "elf-tokenlist/dist/types";

/**
 * Init the tokenlist for given chain
 * @param chainName name of the chain that the tokenlist represents
 * @returns mapping of TokenInfos by address
 */
export function initTokenInfo(chainName: string): Record<string, AnyTokenListInfo> {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const tokenListJson: TokenList = require(`elf-tokenlist/dist/${chainName}.tokenlist.json`);
  const tokenInfos = tokenListJson.tokens;
  const tokenInfoByAddress: Record<string, AnyTokenListInfo> = keyBy(
    tokenInfos,
    "address"
  );
  return tokenInfoByAddress;
}

/**
 * Helper function for looking up a tokenlist info
 * @param address address of the token
 * @param tokenInfoByAddress mapping of TokenInfos by address
 * @returns Mapping of TokenInfos by address
 */
export function getTokenInfo<T extends TokenInfo>(
    address: string,
    tokenInfoByAddress: Record<string, AnyTokenListInfo>): T {
  return tokenInfoByAddress[address] as T;
}


