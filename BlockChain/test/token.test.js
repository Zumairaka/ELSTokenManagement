require("@openzeppelin/hardhat-upgrades");

const { ethers, upgrades } = require("hardhat");
const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { constants } = require("@openzeppelin/test-helpers");
const expectEvent = require("@openzeppelin/test-helpers/src/expectEvent");

describe("ELSToken", () => {
  let admin, add1, add2, ELSToken, elsToken;

  function getAmount(value) {
    return BigNumber.from(value).mul(
      BigNumber.from(10).pow(BigNumber.from(18))
    );
  }

  beforeEach(async () => {
    // initialize the signers
    [admin, add1, add2] = await ethers.getSigners();

    // deploy the contract using proxy
    ELSToken = await ethers.getContractFactory("ELSToken");
    elsToken = await upgrades.deployProxy(ELSToken, {
      initializer: "initialize"
    });
    await elsToken.deployed();
  });

  describe("Initialize", () => {
    it("Should set the right owner", async () => {
      expect(await elsToken.owner()).to.equal(admin.address);
    });

    it("Should set the name, symbol properly", async () => {
      expect(await elsToken.name()).to.equal("Ethlas Token");
      expect(await elsToken.symbol()).to.equal("ELS");
    });
  });

  describe("Mint Token", () => {
    it("Should revert if the txn is not by the owner", async () => {
      let amount = getAmount(100);

      // mint token
      await expect(
        elsToken.connect(add1).mint(add1.address, amount)
      ).to.be.revertedWith("OwnableUnauthorizedAccount");
    });

    it("Should revert if the account is a zero address", async () => {
      let amount = getAmount(100);

      // mint token
      await expect(
        elsToken.connect(admin).mint(constants.ZERO_ADDRESS, amount)
      ).to.be.revertedWith("ZeroAddress");
    });

    it("Should revert if the amount is zero", async () => {
      let amount = 0;

      // mint token
      await expect(
        elsToken.connect(admin).mint(add1.address, amount)
      ).to.be.revertedWith("ZeroAmount");
    });

    it("Should mint the tokens properly", async () => {
      let amount = getAmount(100);
      let totalSupply = BigNumber.from(getAmount(100000000)).add(
        BigNumber.from(amount)
      );

      // mint token
      let result = await elsToken.connect(admin).mint(add1.address, amount);

      expectEvent.inTransaction(result.tx, elsToken, "ELSTokenMinted", {
        account: add1.address,
        amount: amount
      });

      expect(await elsToken.balanceOf(add1.address)).to.equal(amount);
      expect(await elsToken.totalSupply()).to.equal(totalSupply);
    });
  });

  describe("Burn Token", () => {
    it("Should revert if the txn is not by the owner", async () => {
      let amount = getAmount(100);

      // burn token
      await expect(elsToken.connect(add1).burn(amount)).to.be.revertedWith(
        "OwnableUnauthorizedAccount"
      );
    });

    it("Should revert if the amount is zero", async () => {
      let amount = 0;

      // burn token
      await expect(elsToken.connect(admin).burn(amount)).to.be.revertedWith(
        "ZeroAmount"
      );
    });

    it("Should revert if not enough balance", async () => {
      let amount = getAmount(100000001);

      // burn token
      await expect(elsToken.connect(admin).burn(amount)).to.be.revertedWith(
        "NotEnoughBalanceToBurn"
      );
    });

    it("Should burn the tokens properly", async () => {
      let amount = getAmount(100);
      let totalSupply = BigNumber.from(getAmount(100000000)).sub(
        BigNumber.from(amount)
      );

      // burn token
      let result = await elsToken.connect(admin).burn(amount);

      expectEvent.inTransaction(result.tx, elsToken, "ELSTokenBurnt", {
        amount: amount
      });

      expect(await elsToken.balanceOf(admin.address)).to.equal(totalSupply);
      expect(await elsToken.totalSupply()).to.equal(totalSupply);
    });
  });
});
