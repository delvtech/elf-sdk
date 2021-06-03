import { Provider } from "@ethersproject/providers";
import { Signer } from "ethers";

import { TrancheFactory__factory } from "src/types/factories/TrancheFactory__factory";

/**
 * Returns an array of tranche addresses for a given tranche factory.  filterable by wrapped position.
 *
 * @param trancheFactoryContract The TrancheFactory contract that deployed the tranches
 * @param wrappedPositionAddress The wrapped position to filter by
 * @returns a promise of an array of tranche addresses
 */
export async function getTerms(
  trancheFactoryAddress: string,
  wrappedPositionAddress: string | null,
  signerOrProvider: Signer | Provider
): Promise<string[]> {
  const trancheFactoryContract = TrancheFactory__factory.connect(
    trancheFactoryAddress,
    signerOrProvider
  );

  const queryFilter = trancheFactoryContract.filters.TrancheCreated(
    null,
    wrappedPositionAddress,
    null
  );

  const trancheEvents = await trancheFactoryContract.queryFilter(queryFilter);

  const trancheAddresses: string[] = trancheEvents.map(
    (event) => event.args?.trancheAddress
  );

  return trancheAddresses;
}
