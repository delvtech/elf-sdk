import { Provider } from "@ethersproject/providers";
import { Signer } from "ethers";
import { ERC20, ERC20Permit, WETH, DAI } from "elf-contracts-typechain/dist/types";
/**
 * This method creates a token to contract mapping
 * @param addressesJsonId mainnet or goerli
 * @param signerOrProvider
 * @returns a mapping of token addresses to corresponding pool contracts
 */
export declare function getUnderlyingContractsByAddress(addressesJsonId: string, signerOrProvider: Signer | Provider): Record<string, ERC20 | WETH | DAI | ERC20Permit>;
