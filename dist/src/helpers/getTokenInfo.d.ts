import { TokenInfo, TokenList } from "@uniswap/token-lists";
import {
  PrincipalTokenInfo,
  YieldPoolTokenInfo,
  PrincipalPoolTokenInfo,
  AssetProxyTokenInfo,
  AnyTokenListInfo,
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
export declare function initTokenList(chainName: string): InitTokenListResult;
/**
 * Helper function for looking up a tokenlist info
 * @param address address of the token
 * @param tokenInfoByAddress mapping of TokenInfos by address
 * @returns TokenInfo associated with the address param
 */
export declare function getTokenInfo<T extends TokenInfo>(
  address: string,
  tokenInfoByAddress: Record<string, AnyTokenListInfo>
): T;
/**
 * Finds tokenInfos for AssetProxies.
 * @param tokenInfos
 * @returns list of AssetProxyTokenInfo
 */
export declare function getAssetProxyTokenInfos(
  tokenInfos: TokenInfo[]
): AssetProxyTokenInfo[];
/**
 * Finds tokenInfos for Principal Tokens
 * @param tokenInfos
 * @returns list of PrincipalTokenInfo
 */
export declare function getPrincipalTokenInfos(
  tokenInfos: TokenInfo[]
): PrincipalTokenInfo[];
/**
 * Returns a PrincipalTokenInfo given a TokenInfo for a pool
 * @param poolInfo
 * @param tokenInfos
 * @returns PrincipalTokenInfo
 */
export declare function getPrincipalTokenInfoForPool(
  poolInfo: YieldPoolTokenInfo | PrincipalPoolTokenInfo,
  tokenInfos: TokenInfo[]
): PrincipalTokenInfo;
/**
 * Returns the TokenInfo of the pool corresponding to a Principal Token
 * @param principalTokenAddress
 * @param tokenInfos
 * @returns PrincipalPoolTokenInfo
 */
export declare function getPoolInfoForPrincipalToken(
  principalTokenAddress: string,
  tokenInfos: TokenInfo[]
): PrincipalPoolTokenInfo;
/**
 * Returns the TokenInfos for the Yield Pools
 * @param tokenInfos
 * @returns a list of YieldPoolTokenInfo
 */
export declare function getYieldPoolTokenInfos(
  tokenInfos: TokenInfo[]
): YieldPoolTokenInfo[];
export {};
