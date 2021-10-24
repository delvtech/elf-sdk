import { TokenInfo } from "@uniswap/token-lists";
import { AnyTokenListInfo } from "elf-tokenlist/dist/types";
/**
 * Init the tokenlist for given chain
 * @param chainName name of the chain that the tokenlist represents
 * @returns mapping of TokenInfos by address
 */
export declare function initTokenInfo(
  chainName: string
): Record<string, AnyTokenListInfo>;
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
