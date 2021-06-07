import { ethers } from "hardhat"
import { getTotalSupply } from "../src/getTotalSupply"
import { getReserves, ReservesResult } from "../src/getReserves"
import { calcSpotPricePt, calcSpotPriceYt } from '../src/calcSpotPrice'
import { getTimeUntilExpiration } from '../src/getTimeUntilExpiration'
import { getUnitSeconds } from '../src/getUnitSeconds'
import { BigNumber } from "ethers"

async function main() {
    const pool = "0x9eB7F54C0eCc4d0D2dfF28a1276e36d598F2B0D1" // principal token pool address
    const balVault = "0x65748E8287Ce4B9E6D83EE853431958851550311" // balancer vault address
    const pt = "0x89d66Ad25F3A723D606B78170366d8da9870A879" // principal token address
    const base = "0x9A1000D492d40bfccbc03f413A48F5B6516Ec0Fd" // base token address
    const [signer] = await ethers.getSigners()
    let totalSupply = await getTotalSupply(pool,signer)
    totalSupply = totalSupply.div(BigNumber.from("1000000000000000000"))
    let reserves = await getReserves(pool,balVault,signer)
    let ptReserves = reserves.tokens[0] == pt ? reserves.reserves[0] : reserves.reserves[1]
    ptReserves = ptReserves.div(BigNumber.from("1000000000000000000"))
    let baseReserves = reserves.tokens[0] == base ? reserves.reserves[0] : reserves.reserves[1]
    baseReserves = baseReserves.div(BigNumber.from("1000000000000000000"))
    let timeRemainingSeconds = await getTimeUntilExpiration(pool,signer)
    let unitSeconds = await getUnitSeconds(pool,signer)
    let ptSpotPrice = calcSpotPricePt(baseReserves.toNumber(),ptReserves.toNumber(),totalSupply.toNumber(),timeRemainingSeconds,unitSeconds)
    console.log(`totalSupply: ${totalSupply}`)
    console.log(`ptReserves: ${ptReserves}`)
    console.log(`baseReserves: ${baseReserves}`)
    console.log(`timeRemainingSeconds: ${timeRemainingSeconds}`)
    console.log(`unitSeconds: ${unitSeconds}`)
    console.log(`ptSpotPrice: ${ptSpotPrice}`)
  }
  main()
