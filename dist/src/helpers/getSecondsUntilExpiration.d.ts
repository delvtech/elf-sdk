import { Provider } from "@ethersproject/providers";
import { Signer } from "ethers";
import { PrincipalPoolTokenInfo, YieldPoolTokenInfo } from "elf-tokenlist";
/**
 * Get the seconds until expiration for a given pool
 * @param poolAddress any pool with a getPoolId method
 * @param signerOrProvider
 * @param timestamp timestamp of the latest block
 * @returns the seconds until expiration
 */
export declare function getSecondsUntilExpiration(
  poolAddress: string,
  signerOrProvider: Signer | Provider,
  timestamp: number
): Promise<number>;
/**
 * Get the seconds until expiration for a given pool using tokenlist.
 * @param poolTokenInfo PoolTokenInfo with extension property expiration
 * @param timestamp timestamp of the latest block
 * @returns the seconds until expiration
 */
export declare function getSecondsUntilExpirationByTokenInfo(
  poolTokenInfo: PrincipalPoolTokenInfo | YieldPoolTokenInfo,
  timestamp: number
): number;
