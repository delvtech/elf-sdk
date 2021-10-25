import { TokenInfo, TokenList } from "@uniswap/token-lists";
import {
  PrincipalTokenInfo,
  YieldPoolTokenInfo,
  PrincipalPoolTokenInfo,
  AssetProxyTokenInfo,
  AnyTokenListInfo,
} from "elf-tokenlist";
import { AddressesJsonFile } from "elf-tokenlist/dist/AddressesJsonFile";
export declare enum TokenListTag {
  VAULT = "vault",
  ASSET_PROXY = "assetproxy",
  CCPOOL = "ccpool",
  PRINCIPAL = "eP",
  UNDERLYING = "underlying",
  WPOOL = "wpool",
  YIELD = "eY",
}
/**
 * Init the tokenlist for given chain
 * @param chainName name of the chain that the tokenlist represents
 * @returns Tuple containing tokenlist and mapping of TokenInfos by address
 */
export declare function initTokenList(
  chainName: string
): [TokenList, AddressesJsonFile, Record<string, AnyTokenListInfo>];
/**
 * Helper function for looking up a tokenlist info
 * @param address address of the token
 * @param tokenInfoByAddress mapping of TokenInfos by address
 * @returns Mapping of TokenInfos by address
 */
export declare function getTokenInfo<T extends TokenInfo>(
  address: string,
  tokenInfoByAddress: Record<string, AnyTokenListInfo>
): T;
export declare function getAssetProxyTokenInfos(
  tokenInfos: TokenInfo[]
): AssetProxyTokenInfo[];
export declare function getPrincipalTokenInfos(
  tokenInfos: TokenInfo[]
): PrincipalTokenInfo[];
export declare function getPrincipalTokenInfoForPool(
  poolInfo: YieldPoolTokenInfo | PrincipalPoolTokenInfo,
  tokenInfos: TokenInfo[]
): PrincipalTokenInfo;
export declare function getPoolInfoForPrincipalToken(
  principalTokenAddress: string,
  tokenInfos: TokenInfo[]
): PrincipalPoolTokenInfo;
export declare function getYieldPoolTokenInfos(
  tokenInfos: TokenInfo[]
): YieldPoolTokenInfo[];
