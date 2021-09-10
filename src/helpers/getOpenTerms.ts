import { Provider } from "@ethersproject/providers";
import { TrancheFactory__factory } from "elf-contracts-typechain";
import { Signer } from "ethers";
import { getLatestBlockTimestamp } from "./getLatestBlockTimestamp";

/**
 * Returns an array of not expired tranche addresses.
 *
 * @param trancheFactoryAddress The TrancheFactory that deployed the tranches
 * @returns a promise of an array of tranche addresses
 */

export async function getOpenTerms(
  trancheFactoryAddress: string,
  signerOrProvider: Signer | Provider
): Promise<string[]> {
  const trancheFactoryContract = TrancheFactory__factory.connect(
    trancheFactoryAddress,
    signerOrProvider
  );

  const queryFilter = trancheFactoryContract.filters.TrancheCreated(
    null,
    null,
    null
  );

  const trancheEvents = await trancheFactoryContract.queryFilter(queryFilter);
  const timestamp = await getLatestBlockTimestamp();

  const notExpiredTranches: string[] = trancheEvents
    .filter((event) => event.args?.expiration.toNumber() > timestamp)
    .map((event) => event.args?.trancheAddress);  

  return notExpiredTranches;
}
