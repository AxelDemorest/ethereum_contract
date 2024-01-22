import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("Crowdsale", function () {
    async function deployContract() {
        const [owner] = await ethers.getSigners();

        // Adresse fictive d'un contrat ERC20
        const token = "0x1234567890123456789012345678901234567890";
        // Prix du token
        const tokenPrice = ethers.parseUnits("0.001", "ether");
        // Moment d'ouverture de la levée de fonds
        const openingTime = Math.floor(Date.now() / 1000);
        // Moment de fermeture de la levée de fonds
        const closingTime = openingTime + 86400;

        const Crowdsale = await ethers.getContractFactory("CrowdSale");
        const crowdsale = await Crowdsale.deploy(token, tokenPrice, openingTime, closingTime, owner.getAddress());

        const PornCoin = await ethers.getContractFactory("PornCoin");
        const pornCoin = await PornCoin.deploy();

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

    it("Should purshase tokens", async function () {
        const { crowdsale, owner, pornCoin } = await loadFixture(deployContract);

        // Obtenez le solde du propriétaire
        const ownerBalance = await pornCoin.balanceOf(owner.getAddress());



    });
});
