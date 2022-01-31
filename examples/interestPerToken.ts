import { ethers } from "hardhat";
import { getInterestPerToken } from "../src/helpers/getInterestPerToken";
import { mainnetTokenList, TokenTag } from "elf-tokenlist";
import { Tranche__factory } from "elf-contracts-typechain";

async function main() {
  const [signer] = await ethers.getSigners();

  const trancheAddresses = mainnetTokenList.tokens
    .filter((tokenInfo) =>
      tokenInfo.tags?.some((tag) => tag === TokenTag.PRINCIPAL)
    )
    .map((tokenInfo) => tokenInfo.address);

  const interestPerTokenList = await Promise.all(
    trancheAddresses.map((trancheAddress) =>
      getInterestPerToken(trancheAddress, signer)
    )
  );

  const trancheSymbols = await Promise.all(
    trancheAddresses.map(async (trancheAddress) => {
      const tranche = Tranche__factory.connect(trancheAddress, signer);
      return await tranche.symbol();
    })
  );

  interestPerTokenList.forEach((amount, idx) => {
    console.log(`${ethers.utils.formatEther(amount)} - ${trancheSymbols[idx]}`);
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
