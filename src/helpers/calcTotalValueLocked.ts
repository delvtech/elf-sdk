import { Currencies, Money } from "ts-money";
import { TokenInfo, TokenList } from "@uniswap/token-lists";
import { Contract, Signer, BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { Provider } from "@ethersproject/providers";
import keyBy from "lodash/keyby";

import { Tranche__factory } from "elf-contracts-typechain/dist/types/factories/Tranche__factory";
import { YVaultAssetProxy__factory } from "elf-contracts-typechain/dist/types/factories/YVaultAssetProxy__factory";
import { Vault__factory } from "elf-contracts-typechain/dist/types/factories/Vault__factory";
import { WeightedPool__factory } from "elf-contracts-typechain/dist/types/factories/WeightedPool__factory";
import { ERC20__factory } from "elf-contracts-typechain/dist/types/factories/ERC20__factory";
import { WeightedPool } from "elf-contracts-typechain/dist/types/WeightedPool";
import {
  ERC20,
  ERC20Permit,
  WETH,
  DAI,
} from "elf-contracts-typechain/dist/types";
import {
  PrincipalTokenInfo,
  YieldPoolTokenInfo,
  PrincipalPoolTokenInfo,
  AssetProxyTokenInfo,
  AnyTokenListInfo,
} from "elf-tokenlist";
import { AddressesJsonFile } from "elf-tokenlist/dist/AddressesJsonFile";
import { getUnderlyingContractsByAddress } from "./getUnderlyingContractsByAddress";
import { getTokenPrice } from "../prices/getTokenPrice";
import {
  getTokenInfo,
  initTokenList,
  getPrincipalTokenInfos,
  getYieldPoolTokenInfos,
  getPoolInfoForPrincipalToken,
  getPrincipalTokenInfoForPool,
  getAssetProxyTokenInfos,
} from "./getTokenInfo";

/**
 * Calculate the TVL
 * @param chainName
 * @param signerOrProvider
 * @returns TVL
 */
export async function calcTotalValueLocked(
  chainName: string,
  signerOrProvider: Signer | Provider
): Promise<Money> {
  const currency = Currencies.USD;
  const { tokenList, addressesJson, tokenInfoByAddress } =
    initTokenList(chainName);
  const underlyingContractsByAddress = getUnderlyingContractsByAddress(
    chainName,
    signerOrProvider
  );
  const assetProxyTokenInfos = getAssetProxyTokenInfos(tokenList.tokens);
  const principalTokenInfos = getPrincipalTokenInfos(tokenList.tokens);
  const results = await Promise.all(
    principalTokenInfos.map(async (tokenInfo) => {
      const baseAssetContract =
        underlyingContractsByAddress[tokenInfo.extensions.underlying];
      const baseAssetPrice = await getTokenPrice(
        chainName,
        baseAssetContract as ERC20,
        currency,
        signerOrProvider
      );
      return calcTotalValueLockedForTerm(
        tokenInfo,
        addressesJson.addresses.balancerVaultAddress,
        underlyingContractsByAddress,
        assetProxyTokenInfos,
        tokenList.tokens,
        tokenInfoByAddress,
        baseAssetPrice,
        signerOrProvider
      );
    })
  );

  let totalValueLocked = Money.fromDecimal(0, currency);
  results.forEach(
    (result) => (totalValueLocked = totalValueLocked.add(result))
  );

  return totalValueLocked;
}

/**
 * Calculate the TVL for a term
 * @param trancheInfo
 * @param balancerVaultAddress
 * @param underlyingContractsByAddress
 * @param assetProxyTokenInfos
 * @param tokenInfos
 * @param tokenInfoByAddress
 * @param baseAssetPrice
 * @param signerOrProvider
 * @returns TVL for term
 */
export async function calcTotalValueLockedForTerm(
  trancheInfo: PrincipalTokenInfo,
  balancerVaultAddress: string,
  underlyingContractsByAddress: Record<
    string,
    ERC20 | WETH | DAI | ERC20Permit
  >,
  assetProxyTokenInfos: AssetProxyTokenInfo[],
  tokenInfos: TokenInfo[],
  tokenInfoByAddress: Record<string, AnyTokenListInfo>,
  baseAssetPrice: Money,
  signerOrProvider: Signer | Provider
): Promise<Money> {
  const principalTokenInfos = getPrincipalTokenInfos(tokenInfos);
  const trancheContracts = principalTokenInfos.map(({ address }) =>
    Tranche__factory.connect(address, signerOrProvider)
  );

  const trancheContractsByAddress = keyBy(
    trancheContracts,
    (tranche) => tranche.address
  );

  const { address, decimals } = trancheInfo;
  const tranche = trancheContractsByAddress[address];
  const poolInfo = getPoolInfoForPrincipalToken(address, tokenInfos);
  const yieldPoolTokenInfos = getYieldPoolTokenInfos(tokenInfos);
  const { address: yieldPoolAddress } = getPoolForYieldToken(
    trancheInfo.extensions.interestToken,
    yieldPoolTokenInfos,
    signerOrProvider
  );
  const yieldPoolInfo = getTokenInfo<YieldPoolTokenInfo>(
    yieldPoolAddress,
    tokenInfoByAddress
  );

  // get all components of TVL: base asset in tranche, base asset in pool, accumulated interest for
  // tranche
  const baseAssetLockedBNPromise = tranche.valueSupplied();
  const accumulatedInterestBNPromise = getAccumulatedInterestForTranche(
    poolInfo,
    assetProxyTokenInfos,
    tokenInfos,
    signerOrProvider
  );
  const baseReservesInPrincipalPoolBNPromise = getBaseAssetReservesInPool(
    poolInfo,
    balancerVaultAddress,
    tokenInfoByAddress,
    underlyingContractsByAddress,
    signerOrProvider
  );
  const baseReservesInYieldPoolBNPromise = getBaseAssetReservesInPool(
    yieldPoolInfo,
    balancerVaultAddress,
    tokenInfoByAddress,
    underlyingContractsByAddress,
    signerOrProvider
  );

  const [
    baseAssetLockedBN,
    accumulatedInterestBN,
    baseReservesInPrincipalPoolBN,
    baseReservesInYieldPoolBN,
  ] = await Promise.all([
    baseAssetLockedBNPromise,
    accumulatedInterestBNPromise,
    baseReservesInPrincipalPoolBNPromise,
    baseReservesInYieldPoolBNPromise,
  ]);

  // convert to numbers
  const baseAssetLocked = +formatUnits(baseAssetLockedBN || 0, decimals);
  const accumulatedInterest = +formatUnits(
    accumulatedInterestBN || 0,
    decimals
  );
  const baseReservesInPrincipalPool = +formatUnits(
    baseReservesInPrincipalPoolBN || 0,
    decimals
  );
  const baseReservesInYieldPool = +formatUnits(
    baseReservesInYieldPoolBN || 0,
    decimals
  );

  // get total, convert to fiat
  const totalFiatValueLocked = baseAssetPrice.multiply(
    baseAssetLocked +
      accumulatedInterest +
      baseReservesInPrincipalPool +
      baseReservesInYieldPool,
    Math.round
  );

  return totalFiatValueLocked;
}

/**
 * Return the accumulated interest for a term
 * @param poolInfo
 * @param assetProxyTokenInfos
 * @param tokenInfos
 * @param signerOrProvider
 * @returns accumulated interest
 */
export async function getAccumulatedInterestForTranche(
  poolInfo: YieldPoolTokenInfo | PrincipalPoolTokenInfo,
  assetProxyTokenInfos: AssetProxyTokenInfo[],
  tokenInfos: TokenInfo[],
  signerOrProvider: Signer | Provider
): Promise<BigNumber> {
  const {
    address: trancheAddress,
    extensions: { position: vaultAssetProxyAddress },
  } = getPrincipalTokenInfoForPool(poolInfo, tokenInfos);
  const principalTokenInfos = getPrincipalTokenInfos(tokenInfos);
  const trancheContracts = principalTokenInfos.map(({ address }) =>
    Tranche__factory.connect(address, signerOrProvider)
  );

  const trancheContractsByAddress = keyBy(
    trancheContracts,
    (tranche) => tranche.address
  );

  const trancheContract = trancheContractsByAddress[trancheAddress];
  const assetProxyContracts = assetProxyTokenInfos.map(({ address }) =>
    YVaultAssetProxy__factory.connect(address, signerOrProvider)
  );

  const assetProxyContractsByAddress = keyBy(
    assetProxyContracts,
    (position) => position.address
  );

  const yVaultAssetProxy = assetProxyContractsByAddress[vaultAssetProxyAddress];

  // this is the amount of underlying that has been deposited into the tranche.
  const balanceOfUnderlying = await trancheContract.valueSupplied();

  // the wrapped position has shares of a yearn vault.  this returns the base asset value of the
  // shares that this tranche has.  the method is poorly named.
  const valueOfSharesInUnderlying = await yVaultAssetProxy.balanceOfUnderlying(
    trancheAddress
  );

  return valueOfSharesInUnderlying.sub(balanceOfUnderlying);
}

/**
 * Return the base asset reserves in a pool
 * @param poolInfo
 * @param balancerVaultAddress
 * @param tokenInfoByAddress
 * @param underlyingContractsByAddress
 * @param signerOrProvider
 * @returns number representing the base assets
 */
export async function getBaseAssetReservesInPool(
  poolInfo: YieldPoolTokenInfo | PrincipalPoolTokenInfo,
  balancerVaultAddress: string,
  tokenInfoByAddress: Record<string, AnyTokenListInfo>,
  underlyingContractsByAddress: Record<
    string,
    ERC20 | WETH | DAI | ERC20Permit
  >,
  signerOrProvider: Signer | Provider
): Promise<BigNumber> {
  const balancerVaultContract = Vault__factory.connect(
    balancerVaultAddress,
    signerOrProvider
  );

  const [, balances] = await balancerVaultContract.getPoolTokens(
    poolInfo.extensions.poolId
  );
  const { baseAssetIndex } = getPoolTokens(
    poolInfo,
    tokenInfoByAddress,
    underlyingContractsByAddress,
    signerOrProvider
  );
  return balances?.[baseAssetIndex];
}

function getPoolForYieldToken(
  yieldTokenAddress: string,
  YieldPoolTokenInfos: YieldPoolTokenInfo[],
  signerOrProvider: Signer | Provider
): WeightedPool {
  const yieldPool = YieldPoolTokenInfos.find(
    ({ extensions: { interestToken } }) => interestToken === yieldTokenAddress
  ) as YieldPoolTokenInfo;

  const yieldPoolContracts = YieldPoolTokenInfos.map(({ address }) =>
    WeightedPool__factory.connect(address, signerOrProvider)
  );

  const yieldPoolContractsByAddress = keyBy(
    yieldPoolContracts,
    (yieldPool) => yieldPool.address
  );
  return yieldPoolContractsByAddress[yieldPool.address];
}

interface PoolTokens {
  baseAssetInfo: TokenInfo;
  termAssetInfo: TokenInfo;
  baseAssetContract: ERC20;
  termAssetContract: ERC20;
  baseAssetIndex: number;
  termAssetIndex: number;
  sortedAddresses: [string, string];
}

/**
 * Get the tokens in the pool corresponding to ther poolInfo
 * @param poolInfo
 * @param tokenInfoByAddress
 * @param underlyingContractsByAddress
 * @param signerOrProvider
 * @returns PoolTokens
 */
export function getPoolTokens(
  poolInfo: YieldPoolTokenInfo | PrincipalPoolTokenInfo,
  tokenInfoByAddress: Record<string, AnyTokenListInfo>,
  underlyingContractsByAddress: Record<
    string,
    ERC20 | WETH | DAI | ERC20Permit
  >,
  signerOrProvider: Signer | Provider
): PoolTokens {
  const baseAssetAddress = poolInfo?.extensions.underlying;
  const termAssetAddress =
    (poolInfo as PrincipalPoolTokenInfo)?.extensions?.bond ??
    (poolInfo as YieldPoolTokenInfo)?.extensions?.interestToken;
  const baseAssetInfo = getTokenInfo(baseAssetAddress, tokenInfoByAddress);
  const termAssetInfo = getTokenInfo(termAssetAddress, tokenInfoByAddress);
  const baseAssetContract = underlyingContractsByAddress[
    baseAssetAddress
  ] as ERC20;
  const termAssetContract = getSmartContractFromRegistry(
    termAssetAddress,
    ERC20__factory.connect,
    signerOrProvider
  ) as ERC20;

  const sortedAddresses = sortAddresses([
    baseAssetAddress,
    termAssetAddress,
  ]) as [string, string];

  const baseAssetIndex = sortedAddresses.findIndex(
    (address) => address === baseAssetAddress
  );
  const termAssetIndex = sortedAddresses.findIndex(
    (address) => address === termAssetAddress
  );

  return {
    baseAssetInfo,
    baseAssetContract,
    baseAssetIndex,
    termAssetInfo,
    termAssetContract,
    termAssetIndex,
    sortedAddresses,
  };
}

function sortAddresses(addresses: string[]): string[] {
  const lowerCaseAddresses = addresses.map((address) => address.toLowerCase());

  // map of lower case addresses to mixed case addresses
  const addressMap: Record<string, string> = {};
  lowerCaseAddresses.forEach((lowerCaseAddress, index) => {
    addressMap[lowerCaseAddress] = addresses[index];
  });

  const sortedLowerCaseAddresses = lowerCaseAddresses.map((a) => a).sort();
  const sortedAddresses = sortedLowerCaseAddresses.map(
    (lowerCaseAddress) => addressMap[lowerCaseAddress]
  );

  return sortedAddresses;
}

// Do not export this from this file
const SMART_CONTRACTS_REGISTRY: Record<string, unknown> = {};

type FactoryConnectFn<TReturnContract extends Contract> = (
  address: string,
  signerOrProvider: Signer | Provider
) => TReturnContract;

function getSmartContractFromRegistry<TReturnContract extends Contract>(
  address: string | undefined,
  factoryConnect: FactoryConnectFn<TReturnContract>,
  signerOrProvider: Signer | Provider
): TReturnContract | undefined {
  if (!address) {
    return undefined;
  }

  // Pull from cache if we have the instance already
  const cachedContract = SMART_CONTRACTS_REGISTRY[address];
  if (cachedContract) {
    return cachedContract as TReturnContract;
  }

  // Otherwise populate cache and return it
  SMART_CONTRACTS_REGISTRY[address] = factoryConnect(address, signerOrProvider);

  return SMART_CONTRACTS_REGISTRY[address] as TReturnContract;
}
