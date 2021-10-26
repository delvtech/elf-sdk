import { Currency, Money } from "ts-money";
import { Provider } from "@ethersproject/providers";
import { Signer, BigNumber } from "ethers";
import { ERC20 } from "elf-contracts-typechain/dist/types/ERC20";
export declare const NUM_ETH_DECIMALS = 18;
export declare const ONE_ETHER: BigNumber;
export declare function getTokenPrice<TContract extends ERC20>(
  chainName: string,
  contract: TContract,
  currency: Currency,
  signerOrProvider: Signer | Provider
): Promise<Money>;
interface FormatBalanceOptions {
  /**
   * Whether or not to include commas when formatting, default is true.
   * Example: "1,000,000"
   */
  formatCommas: boolean;
}
export declare function formatBalance(
  balance: BigNumber | undefined,
  decimals: number | undefined,
  options?: FormatBalanceOptions
): string;
export {};
