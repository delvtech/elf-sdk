import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
/**
 * Returns the PoolId for a given pool.
 * @param poolAddress any pool with a getPoolId method
 * @param signerOrProvider
 * @returns a promise for a poolId
 */
export declare function getPoolId(
  poolAddress: string,
  signerOrProvider: Signer | Provider
): Promise<string>;
