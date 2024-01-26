import { task } from "hardhat/config";

export default task("deploy").setAction(async (taskArgs, hre) => {
    // Prix du token
    const tokenPrice = 1;
    // Moment d'ouverture de la levée de fonds
    const openingTime = Math.floor(Date.now() / 1000);
    // Moment de fermeture de la levée de fonds
    const closingTime = openingTime + 86400;

    const PornCoin = await hre.ethers.getContractFactory("PornCoin");
    const pornCoin = await PornCoin.deploy();

    const Crowdsale = await hre.ethers.getContractFactory("CrowdSale");
    const crowdsale = await Crowdsale.deploy(await pornCoin.getAddress(), tokenPrice, openingTime, closingTime);

    await pornCoin.waitForDeployment();
    await crowdsale.waitForDeployment();

    console.log(`PornCoin deployed to ${pornCoin.target}`);
    console.log(`Crowdsale deployed to ${crowdsale.target}`);

    let currentBlock = await hre.ethers.provider.getBlockNumber();

    while (currentBlock + 5 > (await hre.ethers.provider.getBlockNumber())) {}

    await pornCoin.transfer(
        await crowdsale.getAddress(),
        hre.ethers.parseUnits("20", 18)
    );

    await hre.run("verify:verify", {
        address: await pornCoin.getAddress(),
    });

    await hre.run("verify:verify", {
        address: await crowdsale.getAddress(),
        constructorArguments: [await pornCoin.getAddress()],
    });
});
