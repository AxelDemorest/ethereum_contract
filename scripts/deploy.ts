import { ethers } from "hardhat";

async function main() {
  const tokenPrice = 1;
  // Moment d'ouverture de la levée de fonds
  const openingTime = Math.floor(Date.now() / 1000);
  // Moment de fermeture de la levée de fonds
  const closingTime = openingTime + 86400;

  const PornCoin = await ethers.getContractFactory("PornCoin");
  const pornCoin = await PornCoin.deploy();

  await pornCoin.waitForDeployment();
  console.log("PornCoin deployed");

  const CrowdSale = await ethers.getContractFactory("CrowdSale");
  const crowdSale = await CrowdSale.deploy(await pornCoin.getAddress(), tokenPrice, openingTime, closingTime);

  await crowdSale.waitForDeployment();
  console.log("CrowdSale deployed");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
