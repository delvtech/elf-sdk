import { Provider } from "@ethersproject/providers";
import { BigNumber, Signer } from "ethers";

import { BasePool__factory } from "src/types/factories/BasePool__factory";

/**
 * Returns the total supply for a pool.  All balancer v2 pools use an 18 decimal Balancer Pool Token
 * (BPT) to track the total supply.
 * @param poolAddress any pool with a totalSupply method
 * @param balancerVaultAddress the address of the balancer v2 vault
 * @param signerOrProvider
 */
export async function getTotalSupply(
  poolAddress: string,
  signerOrProvider: Signer | Provider
): Promise<BigNumber> {
  const poolContract = BasePool__factory.connect(poolAddress, signerOrProvider);

  const totalSupply = await poolContract.totalSupply();

  return totalSupply;
}
