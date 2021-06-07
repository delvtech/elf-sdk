export function calcSpotPricePt(
    baseReserves: number,
    ptReserves: number,
    totalSupply: number,
    timeRemainingSeconds: number,
    tParamSeconds: number,
  ): number {
    const t = timeRemainingSeconds / tParamSeconds;
    return (baseReserves / (ptReserves + totalSupply))**t
}

export function calcSpotPriceYt(
    baseReserves: number,
    ytReserves: number,
  ): number {
      return baseReserves / ytReserves
}
