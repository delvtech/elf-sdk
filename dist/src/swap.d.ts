import {
  BigNumber,
  ContractTransaction,
  PayableOverrides,
  Signer,
} from "ethers";
export declare const BALANCER_ETH_SENTINEL =
  "0x0000000000000000000000000000000000000000";
export declare enum SwapKind {
  GIVEN_IN = 0,
  GIVEN_OUT = 1,
}
export interface SingleSwap {
  poolId: string;
  kind: SwapKind;
  assetIn: string;
  assetOut: string;
  amount: BigNumber;
  userData: string;
}
export declare const SingleSwap: undefined;
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
export declare function swap(
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
  overrides?: PayableOverrides,
  expirationInSeconds?: number,
  useETH?: boolean,
  wethAddress?: string,
  fromInternalBalance?: boolean,
  toInternalBalance?: boolean
): Promise<ContractTransaction>;
