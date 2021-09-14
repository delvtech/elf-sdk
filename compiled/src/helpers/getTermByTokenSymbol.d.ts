import { Provider } from "@ethersproject/providers";
import { Signer } from "ethers";
/**
 * returns the term matching a token symbol
 * @param termAddresses array of terms addresses
 * @param tokenSymbol the token symbol to filter on
 * @param signerOrProvider
 * @returns a promise for a term address
 */
export declare function getTermByTokenSymbol(
  termAddresses: string[],
  tokenSymbol: string,
  signerOrProvider: Signer | Provider
): Promise<string>;
