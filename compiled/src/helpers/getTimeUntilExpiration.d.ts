import { Provider } from "@ethersproject/providers";
import { Signer } from "ethers";
/**
 * Get the time until expiration for a given pool
 * @param poolAddress any pool with a getPoolId method
 * @param signerOrProvider
 * @param timestamp timestamp of the latest block
 * @returns the time until expiration
 */
export declare function getTimeUntilExpiration(poolAddress: string, signerOrProvider: Signer | Provider, timestamp: number): Promise<number>;
