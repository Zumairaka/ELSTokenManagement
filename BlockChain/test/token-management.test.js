require("@openzeppelin/hardhat-upgrades");

const { ethers, upgrades } = require("hardhat");
const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { constants } = require("@openzeppelin/test-helpers");
const expectEvent = require("@openzeppelin/test-helpers/src/expectEvent");

describe("TokenManagement", () => {
  let admin, add1, add2, ELSToken, elsToken, TokenLock, tokenLock;

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

    // deploy the token lock contract using proxy
    TokenLock = await ethers.getContractFactory("TokenManagement");
    tokenLock = await upgrades.deployProxy(TokenLock, [elsToken.address], {
      initializer: "initializeLocking"
    });
    await tokenLock.deployed();
  });

  describe("Initialize", () => {
    it("Should set the right owner", async () => {
      expect(await tokenLock.owner()).to.equal(admin.address);
    });

    it("Should set the token properly", async () => {
      expect(await tokenLock.getToken()).to.equal(elsToken.address);
    });
  });

  describe("Update Token", () => {
    it("Should revert if the txn is not by the owner", async () => {
      // update token
      await expect(
        tokenLock.connect(add1).updateToken(add1.address)
      ).to.be.revertedWith("OwnableUnauthorizedAccount");
    });

    it("Should revert if the account is a zero address", async () => {
      // update token
      await expect(
        tokenLock.connect(admin).updateToken(constants.ZERO_ADDRESS)
      ).to.be.revertedWith("ZeroAddress");
    });

    it("Should update tokens properly", async () => {
      // update token
      let result = await tokenLock.connect(admin).updateToken(add1.address);

      expectEvent.inTransaction(result.tx, tokenLock, "TokenAddressUpdated", {
        token: add1.address
      });

      expect(await tokenLock.getToken()).to.equal(add1.address);
    });
  });

  describe("Send Token", () => {
    it("Should revert if the amount is zero", async () => {
      let amount = 0;

      // send token
      await expect(
        tokenLock.connect(add1).sendToken(amount)
      ).to.be.revertedWith("ZeroAmount");
    });

    it("Should revert if not enough balance", async () => {
      let amount = getAmount(100);

      // send token
      await expect(
        tokenLock.connect(add1).sendToken(amount)
      ).to.be.revertedWith("NotEnoughTokensToSend");
    });

    it("Should send the tokens properly", async () => {
      let amount = getAmount(100);

      // mint tokens
      elsToken.connect(admin).mint(add1.address, amount);

      // send token
      await elsToken.connect(add1).approve(tokenLock.address, amount);
      let result = await tokenLock.connect(add1).sendToken(amount);

      expectEvent.inTransaction(result.tx, tokenLock, "TokensSent", {
        from: add1.address,
        to: tokenLock.address,
        amount: amount
      });

      expect(await elsToken.balanceOf(add1.address)).to.equal(0);
      expect(await elsToken.balanceOf(tokenLock.address)).to.equal(amount);
      expect(await tokenLock.getBalance(add1.address)).to.equal(amount);
    });
  });

  describe("Withdraw Token", () => {
    it("Should revert if the amount is zero", async () => {
      let amount = 0;

      // withdraw token
      await expect(
        tokenLock.connect(add1).withdrawToken(amount)
      ).to.be.revertedWith("ZeroAmount");
    });

    it("Should revert if not enough balance", async () => {
      let amount = getAmount(100);

      // withdraw token
      await expect(
        tokenLock.connect(add1).withdrawToken(amount)
      ).to.be.revertedWith("NotEnoughTokensToWithdraw");
    });

    it("Should withdraw the tokens properly", async () => {
      let amount = getAmount(100);
      let removal = getAmount(50);

      // mint tokens
      elsToken.connect(admin).mint(add1.address, amount);

      // send token
      await elsToken.connect(add1).approve(tokenLock.address, amount);
      await tokenLock.connect(add1).sendToken(amount);

      // withdraw token
      let result = await tokenLock.connect(add1).withdrawToken(removal);

      expectEvent.inTransaction(result.tx, tokenLock, "TokensSent", {
        from: tokenLock.address,
        to: add1.address,
        amount: amount
      });

      expect(await elsToken.balanceOf(add1.address)).to.equal(removal);
      expect(await elsToken.balanceOf(tokenLock.address)).to.equal(removal);
      expect(await tokenLock.getBalance(add1.address)).to.equal(removal);
    });
  });
});
