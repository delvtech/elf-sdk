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

import { calcSpotPricePt, calcSpotPriceYt } from "../src/helpers/calcSpotPrice";
import {
  THIRTY_DAYS_IN_SECONDS,
  ONE_YEAR_IN_SECONDS,
} from "../src/constants/time";

import { expect } from "chai";
import { BigNumber } from "ethers";

describe("calcSpotPrices", () => {
  it("should properly calculate spot price of PT", () => {
    const ptReserves = BigNumber.from("1000000000000000");
    const baseReserves = BigNumber.from("1612400925773352");
    const totalSupply = baseReserves.add(ptReserves);
    const timeRemainingSeconds = THIRTY_DAYS_IN_SECONDS;
    const timeStretch = 4;
    const tParamSeconds = timeStretch * ONE_YEAR_IN_SECONDS;
    const result = calcSpotPricePt(
      baseReserves.toString(),
      ptReserves.toString(),
      totalSupply.toString(),
      timeRemainingSeconds,
      tParamSeconds
    );
    expect(result).to.equal(0.9835616438356164);
  });

  it("should properly calculate spot price of YT", () => {
    const baseReserves = "24";
    const ytReserves = "12308";
    const result = calcSpotPriceYt(baseReserves, ytReserves);
    expect(result).to.equal(0.0019499512512187196);
  });
});
