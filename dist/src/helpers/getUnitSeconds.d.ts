import { Provider } from "@ethersproject/providers";
import { Signer } from "ethers";
/**
 * Get the unit seconds for a given pool
 * @param poolAddress any pool with a getPoolId method
 * @param signerOrProvider
 * @returns the unit seconds
 */
export declare function getUnitSeconds(
  poolAddress: string,
  signerOrProvider: Signer | Provider
): Promise<number>;
