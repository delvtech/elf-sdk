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

import { providers } from "ethers";

/**
 * Get timestamp of the latest block
 * @returns the timestamp of the latest block
 */
export async function getLatestBlockTimestamp(): Promise<number> {
  const provider = providers.getDefaultProvider();
  const blockNumber = await provider.getBlockNumber();
  const block = await provider.getBlock(blockNumber);
  return block.timestamp;
}
