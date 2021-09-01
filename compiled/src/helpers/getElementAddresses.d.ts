import { DeploymentAddresses } from "typechain/DeploymentAddresses";
export declare enum PoolType {
    PT = 0,
    YT = 1
}
/**
 * Get the contract addresses deployed by Element
 * @param url The url of the json changelog file
 * @returns A Promise for the DeploymentAddresses object
 */
export declare function getElementDeploymentAddresses(url: string): Promise<DeploymentAddresses>;
/**
 * Get TermFactory addresses associated with each term
 * @param deploymentAddresses The DeploymentAddresses object
 * @returns the TermFactory used to deploy each individual term
 */
export declare function getElementTermFactoryAddresses(deploymentAddresses: DeploymentAddresses): string[];
/**
 * Get Element Term addresses
 * @param deploymentAddresses The DeploymentAddresses object
 * @returns An array of Term addresses
 */
export declare function getElementTermAddresses(deploymentAddresses: DeploymentAddresses): string[];
/**
 * Get PtPool addresses associated with each term
 * @param deploymentAddresses The DeploymentAddresses object
 * @returns An array of PT Pool addresses
 */
export declare function getElementPtPoolAddresses(deploymentAddresses: DeploymentAddresses): string[];
/**
 * Get PtPool addresses associated with each term
 * @param deploymentAddresses The DeploymentAddresses object
 * @returns An array of YT Pool addresses
 */
export declare function getElementYtPoolAddresses(deploymentAddresses: DeploymentAddresses): string[];
/**
 * Returns the PoolId from the DeploymentAddresses that matches a termAddress
 * @param termAddress termAddress to filter on
 * @param deploymentAddresses The DeploymentAddresses object
 * @param PoolType Either PT or YT
 * @returns a promise for a poolId
 */
export declare function getPoolIdByTermAddress(termAddress: string, deploymentAddresses: DeploymentAddresses, poolType: PoolType): Promise<string>;
/**
 * Get base address for a given token
 * @param deploymentAddresses The Deployment Addresses object
 * @param tokenKey
 * @returns The base address
 */
export declare function getBaseTokenAddress(deploymentAddresses: DeploymentAddresses, tokenKey: string): string;
