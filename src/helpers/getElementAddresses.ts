/*
 * Copyright 2021 Element Finance, Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import * as https from "https";
import { DeploymentAddresses } from "../../typechain/DeploymentAddresses";

export enum PoolType {
  PT,
  YT,
}

/**
 * Get the contract addresses deployed by Element
 * @param url The url of the json changelog file
 * @returns A Promise for the DeploymentAddresses object
 */
export async function getElementDeploymentAddresses(
  url: string
): Promise<DeploymentAddresses> {
  const params = {
    host: new URL(url).hostname,
    method: "GET",
    path: new URL(url).pathname,
  };

  return new Promise(function (resolve, reject) {
    const req = https.request(params, function (res) {
      let result: DeploymentAddresses;
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error("statusCode=" + res.statusCode));
      }
      const body = [];
      res.on("data", function (chunk) {
        body.push(chunk);
      });
      res.on("end", function () {
        try {
          result = <DeploymentAddresses>(
            JSON.parse(Buffer.concat(body).toString())
          );
        } catch (e) {
          reject(e);
        }
        resolve(result);
      });
    });
    req.on("error", function (err) {
      reject(err);
    });
    req.end();
  });
}

/**
 * Get TermFactory addresses associated with each term
 * @param deploymentAddresses The DeploymentAddresses object
 * @returns the TermFactory used to deploy each individual term
 */
export function getElementTermFactoryAddresses(
  deploymentAddresses: DeploymentAddresses
): string[] {
  // get TermFactories listed in each Term
  const termFactories = [];
  for (const trancheListKey in deploymentAddresses.tranches) {
    const trancheList = deploymentAddresses.tranches[trancheListKey];
    for (const tranche of trancheList) {
      termFactories.push(tranche.trancheFactory);
    }
  }
  // remove dups
  return Array.from(new Set(termFactories));
}

/**
 * Get Element Term addresses
 * @param deploymentAddresses The DeploymentAddresses object
 * @returns An array of Term addresses
 */
export function getElementTermAddresses(
  deploymentAddresses: DeploymentAddresses
): string[] {
  // get each Term
  const terms = [];
  for (const trancheListKey in deploymentAddresses.tranches) {
    const trancheList = deploymentAddresses.tranches[trancheListKey];
    for (const tranche of trancheList) {
      terms.push(tranche.address);
    }
  }
  return terms;
}

/**
 * Get PtPool addresses associated with each term
 * @param deploymentAddresses The DeploymentAddresses object
 * @returns An array of PT Pool addresses
 */
export function getElementPtPoolAddresses(
  deploymentAddresses: DeploymentAddresses
): string[] {
  // get PTPools listed in each Term
  const pools = [];
  for (const trancheListKey in deploymentAddresses.tranches) {
    const trancheList = deploymentAddresses.tranches[trancheListKey];
    for (const tranche of trancheList) {
      pools.push(tranche.ptPool.address);
    }
  }
  return pools;
}

/**
 * Get PtPool addresses associated with each term
 * @param deploymentAddresses The DeploymentAddresses object
 * @returns An array of YT Pool addresses
 */
export function getElementYtPoolAddresses(
  deploymentAddresses: DeploymentAddresses
): string[] {
  // get get YTPools listed in each Term
  const pools = [];
  for (const trancheListKey in deploymentAddresses.tranches) {
    const trancheList = deploymentAddresses.tranches[trancheListKey];
    for (const tranche of trancheList) {
      pools.push(tranche.ytPool.address);
    }
  }
  return pools;
}

/**
 * Returns the PoolId from the DeploymentAddresses that matches a termAddress
 * @param termAddress termAddress to filter on
 * @param deploymentAddresses The DeploymentAddresses object
 * @param PoolType Either PT or YT
 * @returns a promise for a poolId
 */
export async function getPoolIdByTermAddress(
  termAddress: string,
  deploymentAddresses: DeploymentAddresses,
  poolType: PoolType
): Promise<string> {
  let poolId = "";
  for (const trancheListKey in deploymentAddresses.tranches) {
    const trancheList = deploymentAddresses.tranches[trancheListKey];
    for (const tranche of trancheList) {
      if (termAddress == tranche.address) {
        if (poolType == PoolType.PT) {
          poolId = tranche.ptPool.poolId;
        } else {
          poolId = tranche.ytPool.poolId;
        }
      }
    }
  }
  return poolId;
}
