import { Money } from "ts-money";
import { TokenInfo } from "@uniswap/token-lists";
import { Signer, BigNumber } from "ethers";
import { Provider } from "@ethersproject/providers";
import { WeightedPool } from "elf-contracts-typechain/dist/types/WeightedPool";
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
export declare function getPoolForYieldToken(
  yieldTokenAddress: string,
  YieldPoolTokenInfos: YieldPoolTokenInfo[],
  signerOrProvider: Signer | Provider
): WeightedPool;
export declare function useTotalValueLockedForPlatform(
  chainName: string,
  signerOrProvider: Signer | Provider
): Promise<Money>;
export declare function fetchTotalValueLockedForTerm(
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
export declare function fetchAccumulatedInterestForTranche(
  poolInfo: YieldPoolTokenInfo | PrincipalPoolTokenInfo,
  assetProxyTokenInfos: AssetProxyTokenInfo[],
  tokenInfos: TokenInfo[],
  signerOrProvider: Signer | Provider
): Promise<BigNumber>;
export declare function fetchBaseAssetReservesInPool(
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
