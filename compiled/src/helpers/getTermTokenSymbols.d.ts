import { Provider } from "@ethersproject/providers";
import { Signer } from "ethers";
export interface TermTokenSymbolsResult {
    /**
     * name of the Principal Token
     */
    principalTokenSymbol: string;
    /**
     * name of the Yield Token
     */
    yieldTokenSymbol: string;
}
/**
 * returns the token symbols for a given term
 * @param termAddress the address of the term
 * @param signerOrProvider
 * @returns a promise for a TermTokenSymbolsResult
 */
export declare function getTermTokenSymbols(termAddress: string, signerOrProvider: Signer | Provider): Promise<TermTokenSymbolsResult>;
