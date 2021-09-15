rm -rf compiled

npx hardhat compile

tsc --project tsconfig.json

rm ./typechain/index.ts

mkdir -p dist
cp -R compiled/* dist/