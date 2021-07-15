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

import { calcFixedAPR } from "../src/helpers/calcFixedAPR";
import { expect } from "chai";
import { BigNumber } from "ethers";

describe("calcFixedAPR", () => {
  it("should properly calculate fixed APR", () => {
    const spotPrice = 0.982;
    const timeUntilMaturity = 7689600;
    const result = calcFixedAPR(spotPrice, timeUntilMaturity);
    expect(result).to.equal(7.382022471910118);
  });
});

describe("calcFixedAPRTimeZero", () => {
  it("should return fixed APR of 0%", () => {
    const spotPrice = 0.982;
    const timeUntilMaturity = 0;
    const result = calcFixedAPR(spotPrice, timeUntilMaturity);
    expect(result).to.equal(0);
  });
});

describe("calcFixedAPRTimeNegative", () => {
  it("should return fixed APR of 0%", () => {
    const spotPrice = 0.982;
    const timeUntilMaturity = -4;
    const result = calcFixedAPR(spotPrice, timeUntilMaturity);
    expect(result).to.equal(0);
  });
});
