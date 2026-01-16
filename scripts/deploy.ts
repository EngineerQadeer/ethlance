import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const JobContractFactory = await ethers.getContractFactory("JobContract");
  const jobContract = await JobContractFactory.deploy();

  await jobContract.waitForDeployment();

  const contractAddress = await jobContract.getAddress();
  console.log("JobContract deployed to:", contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
