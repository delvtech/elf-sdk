import { Provider } from "@ethersproject/providers";
import { Signer } from "ethers";
import { CRVLUSD } from "elf-contracts-typechain/dist/types/CRVLUSD";
export declare function getCurveStablePoolContractsByAddress(
  chainName: string,
  signerOrProvider: Signer | Provider
): Record<string, CRVLUSD>;
export declare function isCurveStablePool(
  chainName: string,
  address: string
): boolean;
