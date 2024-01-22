import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("Crowdsale", function () {
    async function deployContract() {
        const [owner] = await ethers.getSigners();

        const Crowdsale = await ethers.getContractFactory("Crowdsale");
        const crowdsale = await Crowdsale.deploy();

        const PornCoin = await ethers.getContractFactory("PornCoin");
        const pornCoin = await PornCoin.deploy();

        return { crowdsale, owner, pornCoin };
    }

    it("Should verify exact number of MTK", async function () {
        const { crowdsale, owner, pornCoin } = await loadFixture(deployContract);

        // Obtenez le solde de l'adresse du contrat PornCoin
        const contractBalance = await pornCoin.balanceOf(owner.getAddress());

        const expectedBalance = ethers.parseUnits("1000000000", "ether");

        expect(contractBalance).to.equal(expectedBalance);
    });
});
