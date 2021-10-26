import { Currencies, Currency, Money } from "ts-money";
import { Provider } from "@ethersproject/providers";
import { Signer, BigNumber } from "ethers";
import { parseUnits, commify, formatUnits } from "ethers/lib/utils";
import { ERC20 } from "elf-contracts-typechain/dist/types/ERC20";
import { CRVLUSD } from "elf-contracts-typechain/dist/types/CRVLUSD";
import { fetchCoinGeckoPrice, getCoinGeckoId } from "./coingecko";
import {
  getCrvTriCryptoPoolContract,
  getCrv3CryptoPoolContract,
  getSteCrvPoolContract,
} from "./curve/pools";
import {
  getCurveStablePoolContractsByAddress,
  isCurveStablePool,
} from "./curve/stablePools";

import { getTokenInfo, initTokenList } from "../helpers/getTokenInfo";
import { AddressesJsonFile } from "elf-tokenlist/dist/AddressesJsonFile";

export const NUM_ETH_DECIMALS = 18;
export const ONE_ETHER = parseUnits("1", NUM_ETH_DECIMALS);

export function getTokenPrice<TContract extends ERC20>(
  chainName: string,
  contract: TContract,
  currency: Currency,
  signerOrProvider: Signer | Provider
): Promise<Money> {
  const result = initTokenList(chainName);
  const { symbol: tokenSymbol, decimals } = getTokenInfo(
    contract.address,
    result.tokenInfoByAddress
  );

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const AddressesJson: AddressesJsonFile = require(`elf-tokenlist/dist/${chainName}.addresses.json`);
  const {
    addresses: {
      crvtricryptoAddress,
      stecrvAddress,
      crv3cryptoAddress,
      eurscrvAddress,
    },
  } = AddressesJson;

  // Curve stable pools, eg: crvLUSD
  const isStablePool = isCurveStablePool(chainName, contract.address);

  // Individual Curve non-stable pools, eg crvTricrypto or steCRV
  const isCrvTricrypto = contract.address === crvtricryptoAddress;
  const isSteCrv = contract.address === stecrvAddress;
  const isCrv3crypto = contract.address === crv3cryptoAddress;

  if (isStablePool) {
    const curveVirtualPriceContractsByAddress =
      getCurveStablePoolContractsByAddress(chainName, signerOrProvider);
    const curveStablePoolContract =
      curveVirtualPriceContractsByAddress[contract.address];
    const curveStablePoolPriceResult = fetchCurveStablecoinPoolVirtualPrice(
      curveStablePoolContract,
      decimals,
      currency,
      signerOrProvider
    );
    return curveStablePoolPriceResult;
  }

  if (isCrvTricrypto) {
    const triCryptoPriceResult = fetchTriCryptoPrice(
      currency,
      signerOrProvider
    );
    return triCryptoPriceResult;
  }
  if (isCrv3crypto) {
    const crv3CryptoPriceResult = fetch3CryptoPrice(currency, signerOrProvider);
    return crv3CryptoPriceResult;
  }
  if (isSteCrv) {
    const steCrvPriceResult = fetchSteCrvPrice(currency, signerOrProvider);
    return steCrvPriceResult;
  }
  // Regular base assets
  const coinGeckoPricePromise = fetchCoinGeckoPrice(
    getCoinGeckoId(tokenSymbol) as string,
    currency
  );

  return coinGeckoPricePromise;
}

async function fetchCurveStablecoinPoolVirtualPrice(
  stablePoolContract: CRVLUSD,
  decimals: number,
  currency: Currency,
  signerOrProvider: Signer | Provider
): Promise<Money> {
  const virtualPriceBigNumber = await stablePoolContract.get_virtual_price();
  const price = +formatBalance(virtualPriceBigNumber, decimals);
  return Money.fromDecimal(price, currency, Math.round);
}

const ETHER_INDEX_FOR_CRVTRICRYPTO = 0;

async function fetch3CryptoPrice(
  currency: Currency,
  signerOrProvider: Signer | Provider
): Promise<Money> {
  // tricrypto is made up of usdt, eth, and wbtc so we get a price in usdt
  const usdtPrice = await fetchCoinGeckoPrice(
    getCoinGeckoId("usdt") as string,
    currency
  );

  const crv3CryptoPriceInUSDT = await getCrv3CryptoPoolContract(
    signerOrProvider
  ).calc_withdraw_one_coin(ONE_ETHER, ETHER_INDEX_FOR_CRVTRICRYPTO);

  const price =
    +formatUnits(crv3CryptoPriceInUSDT, 6) / +(usdtPrice as Money).toString();
  return Money.fromDecimal(price, currency, Math.round);
}
async function fetchTriCryptoPrice(
  currency: Currency,
  signerOrProvider: Signer | Provider
): Promise<Money> {
  // tricrypto is made up of usdt, eth, and wbtc so we get a price in usdt
  const usdtPrice = await fetchCoinGeckoPrice(
    getCoinGeckoId("usdt") as string,
    currency
  );

  const triCryptoPriceInUSDT = await getCrvTriCryptoPoolContract(
    signerOrProvider
  ).calc_withdraw_one_coin(ONE_ETHER, ETHER_INDEX_FOR_CRVTRICRYPTO);

  const price =
    +formatUnits(triCryptoPriceInUSDT, 6) / +(usdtPrice as Money).toString();
  return Money.fromDecimal(price, currency, Math.round);
}

const ETHER_INDEX_FOR_STECRV = 0;
async function fetchSteCrvPrice(
  currency: Currency,
  signerOrProvider: Signer | Provider
): Promise<Money> {
  // steCRV is made up of eth and stEth, so we get a price in eth
  const ethPrice = await fetchCoinGeckoPrice(
    getCoinGeckoId("eth") as string,
    currency
  );

  const steCrvPriceInEth = await getSteCrvPoolContract(
    signerOrProvider
  ).calc_withdraw_one_coin(ONE_ETHER, ETHER_INDEX_FOR_STECRV);

  const price =
    +formatUnits(steCrvPriceInEth, NUM_ETH_DECIMALS) *
    +(ethPrice as Money).toString();
  return Money.fromDecimal(price, currency.code, Math.round);
}

interface FormatBalanceOptions {
  /**
   * Whether or not to include commas when formatting, default is true.
   * Example: "1,000,000"
   */
  formatCommas: boolean;
}
const defaultOptions: FormatBalanceOptions = { formatCommas: true };
export function formatBalance(
  balance: BigNumber | undefined,
  decimals: number | undefined,
  options = defaultOptions
): string {
  if (!balance || !decimals) {
    return "0.0000";
  }

  const stringBalance = formatUnits(balance, decimals);
  const { formatCommas } = options;
  if (formatCommas) {
    return commify(stringBalance);
  }
  return stringBalance;
}
