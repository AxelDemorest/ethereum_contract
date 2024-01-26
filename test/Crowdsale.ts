import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("Crowdsale", function () {
    // Prix du token
    const tokenPrice = 1;
    // Moment d'ouverture de la levée de fonds
    const openingTime = Math.floor(Date.now() / 1000);
    // Moment de fermeture de la levée de fonds
    const closingTime = openingTime + 86400;


    async function deployContract() {
        const [owner] = await ethers.getSigners();
        const PornCoin = await ethers.getContractFactory("PornCoin");
        const pornCoin = await PornCoin.deploy();
        const Crowdsale = await ethers.getContractFactory("CrowdSale");
        const crowdsale = await Crowdsale.deploy(await pornCoin.getAddress(), tokenPrice, openingTime, closingTime);

        return { crowdsale, owner, pornCoin };
    }

    it("Should verify that owner has 100% of the tokens", async function () {
        const { owner, pornCoin } = await loadFixture(deployContract);

        // Obtenez le solde du propriétaire
        const ownerBalance = await pornCoin.balanceOf(owner.getAddress());

        // ERC20 a 18 décimales
        const decimal = 18;

        // Vérifiez si le solde du propriétaire est égal au nombre total de PornCoin
        expect(ownerBalance.toString()).to.equal(ethers.parseUnits('100', decimal).toString());
    });

    it("Should purchase tokens", async function () {
        const { crowdsale, owner, pornCoin } = await loadFixture(deployContract);

        await pornCoin.transfer(
            await crowdsale.getAddress(),
            ethers.parseUnits("10", 18)
        );

        await crowdsale.purchaseTokens({
            value: ethers.parseUnits("1", 18),
        });

        expect(await pornCoin.balanceOf(owner)).to.equal(
            ethers.parseUnits("91", 18)
        );
    });

    it("Should recover lasts tokens", async function () {
        const { crowdsale, owner, pornCoin } = await loadFixture(deployContract);

        await pornCoin.transfer(
            await crowdsale.getAddress(),
            ethers.parseUnits("10", 18)
        );

        await crowdsale.purchaseTokens({
            value: ethers.parseUnits("1", 18),
        });

        await crowdsale.setIsClosed(true);

        await crowdsale.withdrawTokens();

        expect(await pornCoin.balanceOf(owner)).to.equal(
            ethers.parseUnits("100", 18)
        );
    });

    it('Should try to purchase tokens if the crowdsale is not open', async function () {
        const { crowdsale, owner, pornCoin } = await loadFixture(deployContract);

        await pornCoin.transfer(
            await crowdsale.getAddress(),
            ethers.parseUnits("10", 18)
        );

        await crowdsale.setIsClosed(true);

        expect(
            crowdsale.purchaseTokens({ value: ethers.parseUnits("1", 18) })
        ).to.be.revertedWith("La levee de fonds n'est pas ouverte");
    });

    it("Should try to recover tokens if the crowdsale is not closed", async function () {
        const { crowdsale, owner, pornCoin } = await loadFixture(deployContract);

        await pornCoin.transfer(
            await crowdsale.getAddress(),
            ethers.parseUnits("10", 18)
        );

        expect(
            crowdsale.withdrawTokens()
        ).to.be.revertedWith("La levee de fonds n'est pas terminee");
    });

    it("Should try to recover ethers if the crowdsale is not closed", async function () {
        const { crowdsale, owner, pornCoin } = await loadFixture(deployContract);

        await pornCoin.transfer(
            await crowdsale.getAddress(),
            ethers.parseUnits("10", 18)
        );

        expect(
            crowdsale.withdrawEther()
        ).to.be.revertedWith("La levee de fonds n'est pas terminee");
    });
});
