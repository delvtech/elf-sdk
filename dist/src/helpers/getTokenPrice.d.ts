import { Currency, Money } from "ts-money";
import { ERC20 } from "elf-contracts-typechain/dist/types/ERC20";
export declare function getTokenPrice<TContract extends ERC20>(
  contract: TContract,
  currency: Currency
): Promise<Money>;
