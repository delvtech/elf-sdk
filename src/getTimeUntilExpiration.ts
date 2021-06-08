import { Provider } from "@ethersproject/providers";
import { BigNumber, Signer,  providers} from "ethers";

import { ConvergentCurvePool__factory } from "../typechain/factories/ConvergentCurvePool__factory";

/**
 * Get the time until expiration for a given pool
 * @param poolAddress any pool with a getPoolId method
 * @param signerOrProvider
 * @returns the time until expiration
 */
export async function getTimeUntilExpiration(
    poolAddress: string,
    signerOrProvider: Signer | Provider
  ): Promise<number> {
  const poolContract = ConvergentCurvePool__factory.connect(poolAddress, signerOrProvider);
    const expiration = await poolContract.expiration();
  const provider = providers.getDefaultProvider();
  const blockNumber = await provider.getBlockNumber();
  const block = await provider.getBlock(blockNumber);
  const blockTimestamp = BigNumber.from(block.timestamp);
  const timeUntilExpiration =  blockTimestamp < expiration
      ? expiration.sub(blockTimestamp)
      : BigNumber.from(0);
  return timeUntilExpiration.toNumber();
}
