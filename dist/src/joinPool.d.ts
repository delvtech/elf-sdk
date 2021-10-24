import { BigNumber, ContractTransaction, Signer } from "ethers";
/**
 * Add liquidity to a ConvergentCurvePool.
 * @param signer Who is authorizing the transaction
 * @param poolId Balancer V2 PoolId
 * @param senderAddress who is depositing the money into the pool
 * @param receipientAddress who is receiving the LP token
 * @param vaultAddress Balancer V2 Vault address
 * @param tokens tokens to deposit, note: sorted alphanumerically.  ETH must be sorted as though it
 * were WETH.
 * @param maxAmountsIn maximum amounts to deposit, same order as tokens.
 * @param fromInternalBalance Use the sender's Balancer V2 internal balance first, if available.
 * @returns returns the contract transaction.
 */
export declare function joinConvergentPool(
  signer: Signer,
  poolId: string,
  senderAddress: string,
  receipientAddress: string,
  vaultAddress: string,
  tokens: string[],
  maxAmountsIn: BigNumber[],
  fromInternalBalance?: boolean
): Promise<ContractTransaction>;
declare enum WeightedPoolJoinKind {
  INIT = 0,
  EXACT_TOKENS_IN_FOR_BPT_OUT = 1,
  TOKEN_IN_FOR_EXACT_BPT_OUT = 2,
}
/**
 * Add liquidity to a WeightedPool.
 * @param signer who is authorizing the transaction.
 * @param poolId Balancer V2 PoolId.
 * @param senderAddress who is depositing the money into the pool.
 * @param receipientAddress who is receiving the LP token.
 * @param vaultAddress Balancer V2 Vault address.
 * @param tokens tokens to deposit, note: sorted alphanumerically.  ETH must be sorted as though it
 * were WETH.
 * @param maxAmountsIn maximum amounts to deposit, same order as tokens.
 * @param minBPTOut minimun amount of LP out, setting this creates a slippage tolerangs.
 * @param fromInternalBalance use the sender's Balancer V2 internal balance first, if available.
 * @param joinKind
 * @returns returns the contract transaction.
 */
export declare function joinWeightedPool(
  signer: Signer,
  poolId: string,
  senderAddress: string,
  receipientAddress: string,
  vaultAddress: string,
  tokens: string[],
  maxAmountsIn: BigNumber[],
  minBPTOut?: BigNumber,
  fromInternalBalance?: boolean,
  joinKind?: WeightedPoolJoinKind
): Promise<ContractTransaction>;
export {};
