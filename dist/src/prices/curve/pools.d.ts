import { Provider } from "@ethersproject/providers";
import { Signer } from "ethers";
import {
  CurveStethPool,
  CurveContract,
} from "elf-contracts-typechain/dist/types";
export declare function getCrvTriCryptoPoolContract(
  signerOrProvider: Signer | Provider
): CurveContract;
export declare function getCrv3CryptoPoolContract(
  signerOrProvider: Signer | Provider
): CurveContract;
export declare function getSteCrvPoolContract(
  signerOrProvider: Signer | Provider
): CurveStethPool;
