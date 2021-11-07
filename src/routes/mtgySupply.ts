import BigNumber from "bignumber.js";
import { Application, Request, Response } from "express";
import Web3 from "web3";
import MTGY from "../libs/MTGY";

const mtgyContractAddy = "0x025c9f1146d4d94F8F369B9d98104300A3c8ca23";
const burnWallet = "0x000000000000000000000000000000000000dEaD";
const devWallet = "0x3A3ffF4dcFCB7a36dADc40521e575380485FA5B8";
const rewardsWallet = "0x87644cB97C1e2Cc676f278C88D0c4d56aC17e838";
const deployerAddress = "0x2d1b8ba4a49c0338a301bd16ff43e4a6d2604dc3";
const lockedAddress1 = "0x2d045410f002a95efcee67759a92518fa3fce677";
// const liquidityAddress = "0xaabafd64feb2ec235b209a95d4dc9b08e225379c";
const multisig = "0x4045B2022ae566E38776c2fF2E5C66FF96a9f028";

const web3 = new Web3(
  new Web3.providers.HttpProvider(`https://bsc-dataseed.binance.org`)
);

export default async function MtgySupply(app: Application) {
  app.get("/supply", async function supplyRoute(_: Request, res: Response) {
    try {
      const mtgyCont = MTGY(web3, mtgyContractAddy);
      const [totalSupply, decimals, burnedAddyBal] = await Promise.all([
        mtgyCont.methods.totalSupply().call(),
        mtgyCont.methods.decimals().call(),
        mtgyCont.methods.balanceOf(burnWallet).call(),
      ]);
      res.send(
        getBalance(totalSupply, decimals)
          .minus(getBalance(burnedAddyBal, decimals))
          .toString()
      );
    } catch (err: any) {
      res.status(500).json({ error: err.stack });
    }
  });

  app.get(
    "/circulating",
    async function circulatingRoute(_: Request, res: Response) {
      try {
        const mtgyCont = MTGY(web3, mtgyContractAddy);
        const [
          totalSupply,
          decimals,
          burnedAddyBal,
          devWalletBal,
          rewardsWalletBal,
          deployerWalletBal,
          lockedWalletBal,
          // liquidityWalletBal,
          multisigBal,
        ] = await Promise.all([
          mtgyCont.methods.totalSupply().call(),
          mtgyCont.methods.decimals().call(),
          mtgyCont.methods.balanceOf(burnWallet).call(),
          mtgyCont.methods.balanceOf(devWallet).call(),
          mtgyCont.methods.balanceOf(rewardsWallet).call(),
          mtgyCont.methods.balanceOf(deployerAddress).call(),
          mtgyCont.methods.balanceOf(lockedAddress1).call(),
          // mtgyCont.methods.balanceOf(liquidityAddress).call(),
          mtgyCont.methods.balanceOf(multisig).call(),
        ]);
        res.send(
          getBalance(totalSupply, decimals)
            .minus(getBalance(burnedAddyBal, decimals))
            .minus(getBalance(devWalletBal, decimals))
            .minus(getBalance(rewardsWalletBal, decimals))
            .minus(getBalance(deployerWalletBal, decimals))
            .minus(getBalance(lockedWalletBal, decimals))
            // .minus(getBalance(liquidityWalletBal, decimals))
            .minus(getBalance(multisigBal, decimals))
            .toString()
        );
      } catch (err: any) {
        res.status(500).json({ error: err.stack });
      }
    }
  );
}

function getBalance(totalBal: number | string, decimals: number | string) {
  return new BigNumber(totalBal).div(new BigNumber(10).pow(decimals));
}
