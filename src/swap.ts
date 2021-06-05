import {
  BigNumber,
  ContractTransaction,
  PayableOverrides,
  Signer,
} from "ethers";

import { Vault__factory } from "../typechain/factories/Vault__factory";

import { ONE_DAY_IN_SECONDS } from "../src/constants/time";

const BALANCER_ETH_SENTINEL = "0x0000000000000000000000000000000000000000";

enum SwapKind {
  GIVEN_IN,
  GIVEN_OUT,
}

interface SingleSwap {
  poolId: string;
  kind: SwapKind;
  assetIn: string;
  assetOut: string;
  amount: BigNumber;
  userData: string;
}

/**
 *
 * @param signer
 * @param sender
 * @param recipient
 * @param poolId
 * @param tokenInAddress
 * @param tokenOutAddress
 * @param balancerVaultAddress
 * @param amount
 * @param kind
 * @param limit
 * @param expirationInSeconds
 * @param useETH
 * @param wethAddress
 * @param fromInternalBalance
 * @param toInternalBalance
 */
export async function swap(
  signer: Signer,
  sender: string,
  recipient: string,
  poolId: string,
  tokenInAddress: string,
  tokenOutAddress: string,
  balancerVaultAddress: string,
  amount: BigNumber,
  kind: SwapKind,
  limit: BigNumber,
  expirationInSeconds: number = ONE_DAY_IN_SECONDS,
  useETH: boolean = false,
  wethAddress?: string,
  fromInternalBalance: boolean = false,
  toInternalBalance: boolean = false
): Promise<ContractTransaction> {
  const assetIn =
    useETH && tokenInAddress === wethAddress
      ? BALANCER_ETH_SENTINEL
      : tokenInAddress;

  const assetOut =
    useETH && tokenOutAddress === wethAddress
      ? BALANCER_ETH_SENTINEL
      : tokenInAddress;

  const swap: SingleSwap = {
    poolId,
    kind,
    assetIn,
    assetOut,
    amount,
    // no need to pass data
    userData: "0x00",
  };

  const funds = {
    sender,
    recipient,
    fromInternalBalance,
    toInternalBalance,
  };

  const deadline = Math.round(Date.now() / 1000) + expirationInSeconds;

  const overrides: PayableOverrides | undefined =
    tokenInAddress === BALANCER_ETH_SENTINEL ? { value: amount } : undefined;

  const vaultContract = Vault__factory.connect(balancerVaultAddress, signer);
  const swapReceipt = await vaultContract.swap(
    swap,
    funds,
    limit,
    deadline,
    overrides
  );

  return swapReceipt;
}
