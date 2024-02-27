require("@openzeppelin/hardhat-upgrades");
const { ethers, upgrades } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with the account: ${deployer.address}`);

  // deploy the token contract using proxy
  const ELSToken = await ethers.getContractFactory("ELSToken");
  const elsToken = await upgrades.deployProxy(ELSToken, {
    initializer: "initialize"
  });
  await elsToken.deployed();
  console.log(
    `Deployed the ELS token contract to the address: ${elsToken.address}`
  );

  // deploy the token lock contract using proxy
  const TokenLock = await ethers.getContractFactory("TokenManagement");
  const tokenLock = await upgrades.deployProxy(TokenLock, [elsToken.address], {
    initializer: "initializeLocking"
  });
  await tokenLock.deployed();
  console.log(
    `Deployed the token management contract to the address: ${tokenLock.address}`
  );
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
