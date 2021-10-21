import { Provider } from "@ethersproject/providers";
import { Signer } from "ethers";

import {
    DAI__factory,
    ERC20__factory,
    ERC20Permit__factory,
  } from "elf-contracts-typechain/dist/types";
import { WETH__factory } from "elf-contracts-typechain/dist/types/factories/WETH__factory";
import { AddressesJsonFile } from "elf-tokenlist/dist/AddressesJsonFile";

  export function getUnderlyingContractsByAddress(
    addressesJsonId: string,  // mainnet or goerli
    signerOrProvider: Signer | Provider
  ): Object {

    const AddressesJson: AddressesJsonFile = require(`elf-tokenlist/dist/${addressesJsonId}.addresses.json`);
    const {
        addresses: {
          wethAddress,
          wbtcAddress,
          usdcAddress,
          daiAddress,
          "alusd3crv-fAddress": crvalusdAddress,
          "mim-3lp3crv-fAddress": crvmimAddress,
          "lusd3crv-fAddress": crvlusdAddress,
          crv3cryptoAddress,
          crvtricryptoAddress,
          stecrvAddress,
          eurscrvAddress,
        },
      } = AddressesJson;

    const wethContract = WETH__factory.connect(wethAddress, signerOrProvider);
    const wbtcContract = ERC20__factory.connect(wbtcAddress, signerOrProvider);
    const usdcContract = ERC20Permit__factory.connect(usdcAddress, signerOrProvider);
    const daiContract = DAI__factory.connect(daiAddress, signerOrProvider);
    const crvlusdContract = ERC20__factory.connect(crvlusdAddress, signerOrProvider);
    const crvalusdContract = ERC20__factory.connect(
        crvalusdAddress,
        signerOrProvider
    );
    const crvmimContract = ERC20__factory.connect(crvmimAddress, signerOrProvider);
    
    const crvTricryptoContract = ERC20__factory.connect(
        crvtricryptoAddress,
        signerOrProvider
    );
    const crv3CryptoContract = ERC20__factory.connect(
        crv3cryptoAddress,
        signerOrProvider
    );
    
    const steCrvContract = ERC20__factory.connect(stecrvAddress, signerOrProvider);
    const eursCrvContract = ERC20__factory.connect(eurscrvAddress, signerOrProvider);

    const underlyingContractsByAddress = Object.freeze({
        [wethAddress]: wethContract,
        [wbtcAddress]: wbtcContract,
        [usdcAddress]: usdcContract,
        [daiAddress]: daiContract,
        [crvlusdAddress]: crvlusdContract,
        [crvalusdAddress]: crvalusdContract,
        [crvtricryptoAddress]: crvTricryptoContract,
        [crv3cryptoAddress]: crv3CryptoContract,
        [crvmimAddress]: crvmimContract,
        [stecrvAddress]: steCrvContract,
        [eurscrvAddress]: eursCrvContract,
      });
      return underlyingContractsByAddress;
  }
  

