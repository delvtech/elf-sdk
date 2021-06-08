import { calcSpotPricePt, calcSpotPriceYt } from "../src/helpers/calcSpotPrice";
import {
  THIRTY_DAYS_IN_SECONDS,
  ONE_YEAR_IN_SECONDS,
} from "../src/constants/time";

import { expect } from "chai";

describe("calcSpotPrices", () => {
  it("should properly calculate spot price of PT", () => {
    const ptReserves = 100;
    const baseReserves = 161.2400925773352;
    const totalSupply = baseReserves + ptReserves;
    const timeRemainingSeconds = THIRTY_DAYS_IN_SECONDS;
    const timeStretch = 4;
    const tParamSeconds = timeStretch * ONE_YEAR_IN_SECONDS;
    const result = calcSpotPricePt(
      baseReserves,
      ptReserves,
      totalSupply,
      timeRemainingSeconds,
      tParamSeconds
    );
    expect(result).to.equal(0.9835616438356164);
  });

  it("should properly calculate spot price of YT", () => {
    const baseReserves = 24;
    const ytReserves = 12308;
    const result = calcSpotPriceYt(baseReserves, ytReserves);
    expect(result).to.equal(0.0019499512512187196);
  });
});
