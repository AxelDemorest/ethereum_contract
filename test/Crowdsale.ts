import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("Crowdsale", function () {
    async function deployContract() {
        const [owner, otherAccount] = await ethers.getSigners();
        const Crowdsale = await ethers.getContractFactory("Crowdsale");
        const crowdsale = await Crowdsale.deploy();

        return { crowdsale, owner, otherAccount };
    }

    it("Should purchase tokens", async function () {
        const { crowdsale, owner, otherAccount } = await loadFixture(deployContract);

    });
});
