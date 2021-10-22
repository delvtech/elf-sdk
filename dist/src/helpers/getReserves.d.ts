import { Provider } from "@ethersproject/providers";
import { BigNumber, Signer } from "ethers";
export interface ReservesResult {
  /**
   * addresses of tokens
   */
  tokens: string[];
  /**
   * balances of tokens in same order as tokens
   */
  balances: BigNumber[];
  /**
   * decimals of tokens in same order as tokens
   */
  decimals: number[];
}
export declare const ReservesResult: undefined;
/**
 * Returns the reserves for a given pool.
 * @param poolAddress any pool with a getPoolId method
 * @param balancerVaultAddress the address of the balancer v2 vault
 * @param signerOrProvider
 */
export declare function getReserves(
  poolAddress: string,
  balancerVaultAddress: string,
  signerOrProvider: Signer | Provider
): Promise<ReservesResult>;
