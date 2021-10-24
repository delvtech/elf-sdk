import { Provider } from "@ethersproject/providers";
import { Signer } from "ethers";
/**
 * Returns an array of not expired tranche addresses.
 *
 * @param trancheFactoryAddress The TrancheFactory that deployed the tranches
 * @returns a promise of an array of tranche addresses
 */
export declare function getOpenTerms(trancheFactoryAddress: string, signerOrProvider: Signer | Provider): Promise<string[]>;
