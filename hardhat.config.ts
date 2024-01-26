import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import deploy from "./tasks/deploy";

require("dotenv").config();

const privateKey = process?.env?.PRIVATE_KEY?.trim() ?? "";
const polygonScanApiKey = process?.env?.POLYGONSCAN_API_KEY?.trim() ?? "";
const config: HardhatUserConfig = {
  networks: {
    hardhat: {},
    polygon: {
      chainId: 137,
      accounts: [privateKey],
      throwOnCallFailures: true,
      throwOnTransactionFailures: true,
      allowUnlimitedContractSize: true,
      url: "https://polygon.llamarpc.com/",
    },
    mumbai: {
      chainId: 80001,
      accounts: [privateKey],
      throwOnCallFailures: true,
      throwOnTransactionFailures: true,
      allowUnlimitedContractSize: true,
      url: "https://polygon-testnet.public.blastapi.io/",
    },
  },
  solidity: {
    version: "0.8.20",
  },
  etherscan: {
    apiKey: {
      polygon: polygonScanApiKey,
      polygonMumbai: polygonScanApiKey,
    },
  },
};

deploy.setDescription("Deploy PornCoin and CrowdSale contracts");

export default config;
