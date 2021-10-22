import { Currencies, Money } from "ts-money";
import { TokenInfo, TokenList } from "@uniswap/token-lists";
import { Contract ,Signer, BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { Provider } from "@ethersproject/providers";
import keyBy from "lodash/keyby";


import { Tranche__factory } from "elf-contracts-typechain/dist/types/factories/Tranche__factory";
import { YVaultAssetProxy__factory } from "elf-contracts-typechain/dist/types/factories/YVaultAssetProxy__factory";
import { Vault__factory } from "elf-contracts-typechain/dist/types/factories/Vault__factory";
import { WeightedPool__factory } from "elf-contracts-typechain/dist/types/factories/WeightedPool__factory";
import { ERC20__factory } from "elf-contracts-typechain/dist/types/factories/ERC20__factory";
import { WeightedPool } from "elf-contracts-typechain/dist/types/WeightedPool";
import { ERC20 } from "elf-contracts-typechain/dist/types/ERC20";
import { PrincipalTokenInfo, YieldPoolTokenInfo, PrincipalPoolTokenInfo, AssetProxyTokenInfo, AnyTokenListInfo } from "elf-tokenlist";
import { getUnderlyingContractsByAddress }  from "./getUnderlyingContractsByAddress";
import { getTokenPrice } from "./getTokenPrice"
type PoolInfo = YieldPoolTokenInfo | PrincipalPoolTokenInfo;

enum TokenListTag {
    VAULT = "vault",
    ASSET_PROXY = "assetproxy",
    CCPOOL = "ccpool",
    PRINCIPAL = "eP",
    UNDERLYING = "underlying",
    WPOOL = "wpool",
    YIELD = "eY",
  }

// TODO: make dynamic?
const chainName = "mainnet";


// eslint-disable-next-line @typescript-eslint/no-var-requires
const tokenListJson: TokenList = require(`elf-tokenlist/dist/${chainName}.tokenlist.json`);

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const AddressesJson = require(`elf-tokenlist/dist/${chainName}.addresses.json`);

export const principalTokenInfos: PrincipalTokenInfo[] =
    tokenListJson.tokens.filter((tokenInfo): tokenInfo is PrincipalTokenInfo =>
      isPrincipalToken(tokenInfo)
    );

export const yieldPools: YieldPoolTokenInfo[] = tokenListJson.tokens.filter(
    (tokenInfo): tokenInfo is YieldPoolTokenInfo => isYieldPool(tokenInfo)
    );

export const assetProxyTokenInfos: AssetProxyTokenInfo[] =
tokenListJson.tokens.filter((tokenInfo): tokenInfo is AssetProxyTokenInfo =>
  isAssetProxy(tokenInfo)
);

/**
 * Helper function for looking up a tokenlist info when you know the type of TokenInfo you want.
 * This is useful when you want strongly-typed properties for `extensions`, eg:
 *
 * const principalToken = getTokenInfo<PrincipalTokenInfo>('0xdeadbeef')
 * const { extensions: { underlying, ... } } = principalToken;
 */
 export function getTokenInfo<T extends TokenInfo>(address: string): T {
    const tokenInfos = tokenListJson.tokens;
    const TokenMetadata: Record<string, AnyTokenListInfo> = keyBy(
        tokenInfos,
        "address"
      );
    return TokenMetadata[address] as T;
  }

export function isPrincipalToken(
    tokenInfo: TokenInfo
  ): tokenInfo is PrincipalTokenInfo {
    return !!tokenInfo?.tags?.includes(TokenListTag.PRINCIPAL);
  }

export function isPrincipalPool(
    tokenInfo: TokenInfo
    ): tokenInfo is PrincipalPoolTokenInfo {
    return !!tokenInfo.tags?.includes(TokenListTag.CCPOOL);
    }

export function getPoolInfoForPrincipalToken(
    principalTokenAddress: string
    ): PrincipalPoolTokenInfo {
    const principalPools: PrincipalPoolTokenInfo[] =
    tokenListJson.tokens.filter(
        (tokenInfo): tokenInfo is PrincipalPoolTokenInfo =>
        isPrincipalPool(tokenInfo)
    );    
    return principalPools.find(
        ({ extensions: { bond } }) => bond === principalTokenAddress
    ) as PrincipalPoolTokenInfo;
}

export function getPoolForYieldToken(
    yieldTokenAddress: string,
    signerOrProvider: Signer | Provider
    ): WeightedPool {
    const yieldPool = yieldPools.find(
      ({ extensions: { interestToken } }) => interestToken === yieldTokenAddress
    ) as YieldPoolTokenInfo;

    const yieldPoolContracts = yieldPools.map(({ address }) =>
    WeightedPool__factory.connect(address, signerOrProvider)
    );

    const yieldPoolContractsByAddress = keyBy(
        yieldPoolContracts,
        (yieldPool) => yieldPool.address
      );
    return yieldPoolContractsByAddress[yieldPool.address];
  }

export function isYieldPool(
    tokenInfo: TokenInfo
  ): tokenInfo is YieldPoolTokenInfo {
    return !!tokenInfo.tags?.includes(TokenListTag.WPOOL);
  }

  function isAssetProxy(tokenInfo: TokenInfo): tokenInfo is PrincipalTokenInfo {
    return !!tokenInfo.tags?.includes(TokenListTag.ASSET_PROXY);
  }

export async function useTotalValueLockedForPlatform(signerOrProvider: Signer | Provider): Promise<Money> {
  const currency = Currencies.USD;
    const results = await Promise.all(
        principalTokenInfos.map(async (tokenInfo) => {
            const underlyingContractsByAddress = getUnderlyingContractsByAddress(chainName, signerOrProvider);
            const baseAssetContract =
            underlyingContractsByAddress[tokenInfo.extensions.underlying];
            const baseAssetPrice = await getTokenPrice(
            baseAssetContract as ERC20,
            currency
            );
            return fetchTotalValueLockedForTerm(tokenInfo, baseAssetPrice, signerOrProvider);
        })
    );

  let totalValueLocked = Money.fromDecimal(0, currency);
  results.forEach(
    (result) => (totalValueLocked = totalValueLocked.add(result))
  );

  return totalValueLocked;
}

export async function fetchTotalValueLockedForTerm(
    trancheInfo: PrincipalTokenInfo,
    baseAssetPrice: Money,
    signerOrProvider: Signer | Provider
  ): Promise<Money> {

    const trancheContracts = principalTokenInfos.map(({ address }) =>
        Tranche__factory.connect(address, signerOrProvider)
    );
  
    const trancheContractsByAddress = keyBy(
        trancheContracts,
        (tranche) => tranche.address
    );

    const { address, decimals } = trancheInfo;
    const tranche = trancheContractsByAddress[address];
    const poolInfo = getPoolInfoForPrincipalToken(address);
    const { address: yieldPoolAddress } = getPoolForYieldToken(
      trancheInfo.extensions.interestToken,
      signerOrProvider
    );
    const yieldPoolInfo = getTokenInfo<YieldPoolTokenInfo>(yieldPoolAddress);
  
    // get all components of TVL: base asset in tranche, base asset in pool, accumulated interest for
    // tranche
    const baseAssetLockedBNPromise = tranche.valueSupplied();
    const accumulatedInterestBNPromise =
      fetchAccumulatedInterestForTranche(poolInfo, signerOrProvider);
    const baseReservesInPrincipalPoolBNPromise =
      fetchBaseAssetReservesInPool(poolInfo, signerOrProvider);
    const baseReservesInYieldPoolBNPromise =
      fetchBaseAssetReservesInPool(yieldPoolInfo, signerOrProvider);
  
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

  export async function fetchAccumulatedInterestForTranche(
    poolInfo: PoolInfo,
    signerOrProvider: Signer | Provider
  ): Promise<BigNumber> {
    const {
      address: trancheAddress,
      extensions: { position: vaultAssetProxyAddress },
    } = getPrincipalTokenInfoForPool(poolInfo);
  
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

  export function getPrincipalTokenInfoForPool(
    poolInfo: PoolInfo
  ): PrincipalTokenInfo {
    if (isPrincipalPool(poolInfo)) {
      const trancheAddress = poolInfo.extensions.bond;
      const trancheInfo = principalTokenInfos.find(
        (info) => info.address === trancheAddress
      ) as PrincipalTokenInfo;
      return trancheInfo;
    }
  
    const interestTokenAddress = poolInfo.extensions.interestToken;
    const trancheInfo = principalTokenInfos.find(
      (info) => info.extensions.interestToken === interestTokenAddress
    ) as PrincipalTokenInfo;
    return trancheInfo;
  }

  export async function fetchBaseAssetReservesInPool(
    poolInfo: PoolInfo,
    signerOrProvider: Signer | Provider
  ): Promise<BigNumber> {

    const balancerVaultContract = Vault__factory.connect(
        AddressesJson.addresses.balancerVaultAddress,
        signerOrProvider
      );

    const [, balances] = await balancerVaultContract.getPoolTokens(
      poolInfo.extensions.poolId
    );
    const { baseAssetIndex } = getPoolTokens(poolInfo, signerOrProvider);
    return balances?.[baseAssetIndex];
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
  
  export function getPoolTokens(
      poolInfo: PoolInfo,
      signerOrProvider: Signer | Provider): PoolTokens {
    const baseAssetAddress = poolInfo?.extensions.underlying;
    const termAssetAddress =
      (poolInfo as PrincipalPoolTokenInfo)?.extensions?.bond ??
      (poolInfo as YieldPoolTokenInfo)?.extensions?.interestToken;
    const baseAssetInfo = getTokenInfo(baseAssetAddress);
    const termAssetInfo = getTokenInfo(termAssetAddress);
    const underlyingContractsByAddress = getUnderlyingContractsByAddress(chainName, signerOrProvider);
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
    SMART_CONTRACTS_REGISTRY[address] = factoryConnect(
      address,
      signerOrProvider
    );
  
    return SMART_CONTRACTS_REGISTRY[address] as TReturnContract;
  }

  