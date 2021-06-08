# ELF SDK
[![Build Status](https://github.com/element-fi/elf-sdk/workflows/Tests/badge.svg)](https://github.com/element-fi/elf-sdk/actions)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/element-fi/elf-sdk/blob/master/LICENSE)

This repo provides an SDK for developers to use when interacting with and building on Element smart contracts.

## Install

```bash
npm install
npm run load-contracts
```

## Build

```bash
npm run build
```

## Configure

To use the Element SDK you need to configure some env variables.  For linux and mac run the following:

1) Copy `elf.default.env`

```bash
cp elf.default.env elf.env
```

2) Update elf.env with your private key and alchemy api key

```bash
export ALCHEMY_KEY=[YOUR_API_KEY_HERE]
export DEPLOYER_PRIVATE_KEY=[YOUR_PRIVATE_KEY_HERE]
```

3) Source the env file

```bash
source elf.env
```

## Run Example Script:

```bash
npx hardhat run examples/spotPrice.ts --network goerli
```
