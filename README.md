# ELF SDK
[![Build Status](https://github.com/element-fi/elf-sdk/workflows/Tests/badge.svg)](https://github.com/element-fi/elf-sdk/actions)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/element-fi/elf-sdk/blob/master/LICENSE)

**⚠️ This is a work in progress! ⚠️**

This repo provides an SDK for developers to use when interacting with and building on Element smart contracts.

## Install

```bash
npm install git+https://github.com/element-fi/elf-sdk.git
npm run generate-interfaces
```

Since this repo is not an npm package, it can be helpful to include this simple script to upgrade your project to the latest commit:

```
 "scripts": {
    "update-elf-contracts-typechain": "npm install git+https://github.com/element-fi/elf-contracts-typechain.git"
  },
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
export MAINNET_PROVIDER_URL=[MAINNET_PROVIDER_URL_HERE]
export GOERLI_PROVIDER_URL=[GOERLI_PROVIDER_URL_HERE]
export PRIVATE_KEY=[PRIVATE_KEY_HERE]
```

3) Source the env file

```bash
source elf.env
```

## Run Example Script:

```bash
npx hardhat run examples/poolDetails.ts --network goerli
```
