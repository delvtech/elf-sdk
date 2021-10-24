import { Provider } from "@ethersproject/providers";
import { BigNumber, Signer } from "ethers";
/**
 * Returns the total supply for a pool.  All balancer v2 pools use an 18 decimal Balancer Pool Token
 * (BPT) to track the total supply.
 * @param poolAddress any pool with a totalSupply method
 * @param signerOrProvider
 */
export declare function getTotalSupply(poolAddress: string, signerOrProvider: Signer | Provider): Promise<BigNumber>;
