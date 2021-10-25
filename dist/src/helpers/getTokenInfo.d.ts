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
export {};
