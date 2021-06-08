import { Provider } from "@ethersproject/providers";
import { BigNumber, Signer,  providers} from "ethers";

import { ConvergentCurvePool__factory } from "../../typechain/factories/ConvergentCurvePool__factory";

/**
 * Get the unit seconds for a given pool
 * @param poolAddress any pool with a getPoolId method
 * @param signerOrProvider
 * @returns the unit seconds
 */
export async function getUnitSeconds(
  poolAddress: string,
  signerOrProvider: Signer | Provider
): Promise<number> {
  const poolContract = ConvergentCurvePool__factory.connect(poolAddress, signerOrProvider);
  const unitSeconds = await poolContract.unitSeconds();
  return unitSeconds.toNumber();
}


