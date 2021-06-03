import { ethers } from "hardhat"
import { getTotalSupply } from "../src/getTotalSupply";

async function main() {
    const poolAddy = "0x40bf8A2eCB62c6B880302b55a5552A4e315b5827"
    const [signer] = await ethers.getSigners()
    let ts = await getTotalSupply(poolAddy,signer)
    console.log(`${poolAddy}: ${ts}`)
  }
  main()
