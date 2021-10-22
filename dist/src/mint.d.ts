import { Provider } from "@ethersproject/providers";
import { BigNumber, ContractTransaction, PayableOverrides, Signer } from "ethers";
export declare const ETH_SENTINEL_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
/**
 * Mints new principal and yield tokens for a given amount of base asset.  The base asset must match
 * the term's underlying.  For terms that accept WETH, ETH can also be used by supplying the ETH_SENTINEL_ADDRESS.
 * @param userProxyContractAddress address of Element's UserProxy
 * @param termExpiration the exiration date of the term in unix seconds
 * @param termPosition the address of the term's wrapped position
 * @param baseAssetAmount the amount of base asset to deposit, i.e. "3.14" Ether
 * @param baseAssetAddress the address of the token to deposit. Use
 * ETH_SENTINEL_ADDRESS to mint with Ether.
 * @param baseAssetDecimals the decimal precision of the asset, i.e. 18 for Ether
 * @param signerOrProvider
 */
export declare function mintWithUserProxy(userProxyContractAddress: string, termExpiration: number, termPosition: string, baseAssetAmount: string, baseAssetAddress: string, baseAssetDecimals: number, signerOrProvider: Signer | Provider, overrides?: PayableOverrides): Promise<ContractTransaction>;
/**
 * get the expiration time in unix seconds for a term.  returns a BigNumber that can be converted
 * to a number with BigNumber.toNumber()
 * @param termAddress the address of the term
 * @param signerOrProvider
 * @returns
 */
export declare function getTermExpiration(termAddress: string, signerOrProvider: Signer | Provider): Promise<BigNumber>;
/**
 * returns the wrapped position address for a given term
 * @param termAddress the address of the term
 * @param signerOrProvider
 * @returns
 */
export declare function getTermPosition(termAddress: string, signerOrProvider: Signer | Provider): Promise<string>;
