import { ethers } from "hardhat"
import { getTotalSupply } from "../src/helpers/getTotalSupply"
import { getReserves, ReservesResult } from "../src/helpers/getReserves"
import { calcSpotPricePt, calcSpotPriceYt } from '../src/helpers/calcSpotPrice'
import { getTimeUntilExpiration } from '../src/helpers/getTimeUntilExpiration'
import { getUnitSeconds } from '../src/helpers/getUnitSeconds'
import { BigNumber } from "ethers"

async function main() {

  const balVault = "0x65748E8287Ce4B9E6D83EE853431958851550311" // balancer vault address
  const base = "0x9A1000D492d40bfccbc03f413A48F5B6516Ec0Fd" // base token address
  const [signer] = await ethers.getSigners()

  // calculate principal token spot price
  const ptPool = "0x9eB7F54C0eCc4d0D2dfF28a1276e36d598F2B0D1" // principal token Pool address
  let totalSupply = await getTotalSupply(ptPool,signer)
  totalSupply = totalSupply.div(BigNumber.from("1000000000000000000"))
  let reserves = await getReserves(ptPool,balVault,signer)
  let ptIndex = reserves.tokens[0] == base ? 1 : 0
  let baseIndex = reserves.tokens[0] == base ? 0 : 1
  let ptDecimals = BigNumber.from(10).pow(BigNumber.from(reserves.decimals[ptIndex]))
  let ptReserves = reserves.balances[ptIndex].div(ptDecimals)
  let baseDecimals = BigNumber.from(10).pow(BigNumber.from(reserves.decimals[baseIndex]))
  let baseReserves = reserves.balances[baseIndex].div(baseDecimals)
  let timeRemainingSeconds = await getTimeUntilExpiration(ptPool,signer)
  let unitSeconds = await getUnitSeconds(ptPool,signer)
  let ptSpotPrice = calcSpotPricePt(baseReserves.toNumber(),ptReserves.toNumber(),totalSupply.toNumber(),timeRemainingSeconds,unitSeconds)
  console.log("\nPrincipal Token")
  console.log(`totalSupply: ${totalSupply}`)
  console.log(`ptReserves: ${ptReserves}`)
  console.log(`baseReserves: ${baseReserves}`)
  console.log(`timeRemainingSeconds: ${timeRemainingSeconds}`)
  console.log(`unitSeconds: ${unitSeconds}`)
  console.log(`ptSpotPrice: ${ptSpotPrice}`)

  // calculate yield token spot price
  const ytPool = "0xD75bfF2444FF738d443066ff4688691e6852b217" // yield token Pool address
  reserves = await getReserves(ytPool,balVault,signer)
  let ytIndex = reserves.tokens[0] == base ? 1 : 0
  baseIndex = reserves.tokens[0] == base ? 0 : 1
  let ytDecimals = BigNumber.from(10).pow(BigNumber.from(reserves.decimals[ytIndex]))
  let ytReserves = reserves.balances[ytIndex].div(ytDecimals)
  baseDecimals = BigNumber.from(10).pow(BigNumber.from(reserves.decimals[baseIndex]))
  baseReserves = reserves.balances[baseIndex].div(baseDecimals)
  let ytSpotPrice = calcSpotPriceYt(baseReserves.toNumber(),ytReserves.toNumber())
  console.log("\nYield Token")
  console.log(`ytReserves: ${ytReserves}`)
  console.log(`baseReserves: ${baseReserves}`)
  console.log(`ytSpotPrice: ${ytSpotPrice}`)  
}

main()
