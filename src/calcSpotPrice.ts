export function calcSpotPriceCCPool(
    xReserves: number,
    yReserves: number,
    totalSupply: number,
    timeRemainingSeconds: number,
    tParamSeconds: number,
  ): number {
    const t = timeRemainingSeconds / tParamSeconds;
    return (xReserves / (yReserves + totalSupply))**t
}
