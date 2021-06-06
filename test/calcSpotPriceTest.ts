import { calcSpotPriceCCPool } from '../src/calcSpotPrice';
import { THIRTY_DAYS_IN_SECONDS,ONE_YEAR_IN_SECONDS } from "../src/constants/time";

import { expect } from 'chai';


describe('calcSpotPriceCCPool', () => {
    const epsilon = 10**(-16)
    it('should properly calculate spot price of PT', () => {
        const yReserves = 100;
        const xReserves = 161.2400925773352;
        const totalSupply = xReserves + yReserves;
        const timeRemainingSeconds = THIRTY_DAYS_IN_SECONDS;
        const tParamSeconds = 4*ONE_YEAR_IN_SECONDS
        const result = calcSpotPriceCCPool(xReserves,yReserves,totalSupply,timeRemainingSeconds,tParamSeconds);
        expect(result).to.equal(0.9835616438356165-epsilon);
  });
});
