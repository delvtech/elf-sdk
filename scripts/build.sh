rm -rf compiled

npx hardhat compile

tsc --project tsconfig.json

rm ./typechain/index.ts