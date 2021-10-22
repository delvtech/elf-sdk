import { Money } from "ts-money";
import { TokenInfo } from "@uniswap/token-lists";
import { Signer, BigNumber } from "ethers";
import { Provider } from "@ethersproject/providers";
import { WeightedPool } from "elf-contracts-typechain/dist/types/WeightedPool";
import { ERC20 } from "elf-contracts-typechain/dist/types/ERC20";
import { PrincipalTokenInfo, YieldPoolTokenInfo, PrincipalPoolTokenInfo } from "elf-tokenlist";
declare type PoolInfo = YieldPoolTokenInfo | PrincipalPoolTokenInfo;
export declare const AddressesJson: any;
/**
 * Helper function for looking up a tokenlist info when you know the type of TokenInfo you want.
 * This is useful when you want strongly-typed properties for `extensions`, eg:
 *
 * const principalToken = getTokenInfo<PrincipalTokenInfo>('0xdeadbeef')
 * const { extensions: { underlying, ... } } = principalToken;
 */
export declare function getTokenInfo<T extends TokenInfo>(address: string): T;
export declare function isPrincipalToken(tokenInfo: TokenInfo): tokenInfo is PrincipalTokenInfo;
export declare function isPrincipalPool(tokenInfo: TokenInfo): tokenInfo is PrincipalPoolTokenInfo;
export declare function getPoolInfoForPrincipalToken(principalTokenAddress: string): PrincipalPoolTokenInfo;
export declare function getPoolForYieldToken(yieldTokenAddress: string, signerOrProvider: Signer | Provider): WeightedPool;
export declare function isYieldPool(tokenInfo: TokenInfo): tokenInfo is YieldPoolTokenInfo;
export declare function useTotalValueLockedForPlatform(signerOrProvider: Signer | Provider): Promise<Money>;
export declare function fetchTotalValueLockedForTerm(trancheInfo: PrincipalTokenInfo, baseAssetPrice: Money, signerOrProvider: Signer | Provider): Promise<Money>;
export declare function fetchAccumulatedInterestForTranche(poolInfo: PoolInfo, signerOrProvider: Signer | Provider): Promise<BigNumber>;
export declare function getPrincipalTokenInfoForPool(poolInfo: PoolInfo): PrincipalTokenInfo;
export declare function fetchBaseAssetReservesInPool(poolInfo: PoolInfo, signerOrProvider: Signer | Provider): Promise<BigNumber>;
interface PoolTokens {
    baseAssetInfo: TokenInfo;
    termAssetInfo: TokenInfo;
    baseAssetContract: ERC20;
    termAssetContract: ERC20;
    baseAssetIndex: number;
    termAssetIndex: number;
    sortedAddresses: [string, string];
}
export declare function getPoolTokens(poolInfo: PoolInfo, signerOrProvider: Signer | Provider): PoolTokens;
export {};
