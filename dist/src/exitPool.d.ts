import { BigNumber, ContractTransaction, Signer } from "ethers";
/**
 * Remove liquidity from a ConvergentCurvePool.
 * @param signer Who is authorizing the transaction
 * @param poolId Balancer V2 PoolId
 * @param senderAddress who is returning LP token to the pool
 * @param receipientAddress who is receiving assets from the pool
 * @param vaultAddress Balancer V2 Vault address
 * @param tokens tokens to withdraw, note: sorted alphanumerically.  ETH must be sorted as though it
 * were WETH.
 * @param minAmountsOut minimum amounts to withdraw, same order as tokens.  The minimum amounts can
 * be set to ensure slippage tolerance.
 * @param fromInternalBalance Use the sender's Balancer V2 internal balance first, if available.
 * @returns returns the contract transaction.
 */
export declare function exitConvergentPool(
  signer: Signer,
  poolId: string,
  senderAddress: string,
  receipientAddress: string,
  vaultAddress: string,
  tokens: string[],
  minAmountsOut: BigNumber[],
  toInternalBalance?: boolean
): Promise<ContractTransaction>;
export declare enum WeightedPoolExitKind {
  EXACT_BPT_IN_FOR_ONE_TOKEN_OUT = 0,
  EXACT_BPT_IN_FOR_TOKENS_OUT = 1,
  BPT_IN_FOR_EXACT_TOKENS_OUT = 2,
}
/**
 * Remove liquidity from a WeightedPool.
 * @param signer Who is authorizing the transaction
 * @param poolId Balancer V2 PoolId
 * @param senderAddress who is returning LP token to the pool
 * @param receipientAddress who is receiving assets from the pool
 * @param vaultAddress Balancer V2 Vault address
 * @param tokens tokens to withdraw, note: sorted alphanumerically.  ETH must be sorted as though it
 * were WETH.
 * @param minAmountsOut minimum amounts to withdraw, same order as tokens.  The minimum amounts can
 * be set to ensure slippage tolerance.
 * @param fromInternalBalance Use the sender's Balancer V2 internal balance first, if available.
 * @param exitKind The exit operation
 * @param maxBPTIn The amount, or max amount of Balancer Pool Token in, depending on the exitKind.
 * @param tokenIndex If withdrawing a single token, the index of the token in tokens
 * @returns returns the contract transaction.
 */
export declare function exitWeightedPool(
  signer: Signer,
  poolId: string,
  senderAddress: string,
  receipientAddress: string,
  vaultAddress: string,
  tokens: string[],
  minAmountsOut: BigNumber[],
  toInternalBalance: boolean | undefined,
  exitKind: WeightedPoolExitKind | undefined,
  maxBPTIn: BigNumber,
  tokenIndex?: number
): Promise<ContractTransaction>;
