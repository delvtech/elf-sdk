import { Money } from "ts-money";
import { TokenInfo } from "@uniswap/token-lists";
import { Signer, BigNumber } from "ethers";
import { Provider } from "@ethersproject/providers";
import {
  ERC20,
  ERC20Permit,
  WETH,
  DAI,
} from "elf-contracts-typechain/dist/types";
import {
  PrincipalTokenInfo,
  YieldPoolTokenInfo,
  PrincipalPoolTokenInfo,
  AssetProxyTokenInfo,
  AnyTokenListInfo,
} from "elf-tokenlist";
/**
 * Calculate the TVL
 * @param chainName
 * @param signerOrProvider
 * @returns TVL
 */
export declare function calcTotalValueLocked(
  chainName: string,
  signerOrProvider: Signer | Provider
): Promise<Money>;
/**
 * Calculate the TVL for a term
 * @param trancheInfo
 * @param balancerVaultAddress
 * @param underlyingContractsByAddress
 * @param assetProxyTokenInfos
 * @param tokenInfos
 * @param tokenInfoByAddress
 * @param baseAssetPrice
 * @param signerOrProvider
 * @returns TVL for term
 */
export declare function calcTotalValueLockedForTerm(
  trancheInfo: PrincipalTokenInfo,
  balancerVaultAddress: string,
  underlyingContractsByAddress: Record<
    string,
    ERC20 | WETH | DAI | ERC20Permit
  >,
  assetProxyTokenInfos: AssetProxyTokenInfo[],
  tokenInfos: TokenInfo[],
  tokenInfoByAddress: Record<string, AnyTokenListInfo>,
  baseAssetPrice: Money,
  signerOrProvider: Signer | Provider
): Promise<Money>;
/**
 * Return the accumulated interest for a term
 * @param poolInfo
 * @param assetProxyTokenInfos
 * @param tokenInfos
 * @param signerOrProvider
 * @returns accumulated interest
 */
export declare function getAccumulatedInterestForTranche(
  poolInfo: YieldPoolTokenInfo | PrincipalPoolTokenInfo,
  assetProxyTokenInfos: AssetProxyTokenInfo[],
  tokenInfos: TokenInfo[],
  signerOrProvider: Signer | Provider
): Promise<BigNumber>;
/**
 * Return the base asset reserves in a pool
 * @param poolInfo
 * @param balancerVaultAddress
 * @param tokenInfoByAddress
 * @param underlyingContractsByAddress
 * @param signerOrProvider
 * @returns number representing the base assets
 */
export declare function getBaseAssetReservesInPool(
  poolInfo: YieldPoolTokenInfo | PrincipalPoolTokenInfo,
  balancerVaultAddress: string,
  tokenInfoByAddress: Record<string, AnyTokenListInfo>,
  underlyingContractsByAddress: Record<
    string,
    ERC20 | WETH | DAI | ERC20Permit
  >,
  signerOrProvider: Signer | Provider
): Promise<BigNumber>;
interface PoolTokens {
  baseAssetInfo: TokenInfo;
  termAssetInfo: TokenInfo;
  baseAssetContract: ERC20;
  termAssetContract: ERC20;
  baseAssetIndex: number;
  termAssetIndex: number;
  sortedAddresses: [string, string];
}
/**
 * Get the tokens in the pool corresponding to ther poolInfo
 * @param poolInfo
 * @param tokenInfoByAddress
 * @param underlyingContractsByAddress
 * @param signerOrProvider
 * @returns PoolTokens
 */
export declare function getPoolTokens(
  poolInfo: YieldPoolTokenInfo | PrincipalPoolTokenInfo,
  tokenInfoByAddress: Record<string, AnyTokenListInfo>,
  underlyingContractsByAddress: Record<
    string,
    ERC20 | WETH | DAI | ERC20Permit
  >,
  signerOrProvider: Signer | Provider
): PoolTokens;
export {};
