import { Provider } from "@ethersproject/providers";
import { Signer } from "ethers";
/**
 * Returns an array of tranche addresses for a given tranche factory.  filterable by wrapped position.
 *
 * @param trancheFactoryAddress The TrancheFactory that deployed the tranches
 * @param wrappedPositionAddress The wrapped position to filter by
 * @returns a promise of an array of tranche addresses
 */
export declare function getTerms(trancheFactoryAddress: string, wrappedPositionAddress: string | null, signerOrProvider: Signer | Provider): Promise<string[]>;
