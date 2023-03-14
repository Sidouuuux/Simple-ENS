const main = async () => {
  const domainContractFactory = await hre.ethers.getContractFactory('Domains');
  const domainContract = await domainContractFactory.deploy("sdx");
  console.log("\n\n🚀 Deploying contract... 🚀\n");

  await domainContract.deployed();

  console.log("\n🎉 Contract deployed to:", domainContract.address + " 🎉");
  // if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
    console.log("\n📝 Waiting for block confirmations... 📝")
    await domainContract.deployTransaction.wait(6)
    await verify(domainContract.address, ["sdx"])
  // }

  const domain = "Sidoux"
  let txn = await domainContract.register(domain, { value: hre.ethers.utils.parseEther('0.1') });
  await txn.wait();
  console.log("Minted domain Sidoux.sdx");

  txn = await domainContract.setRecord(domain, "mirsidahmed@hotmail.fr");
  await txn.wait();
  console.log("Set record for Sidoux.sdx");

  const address = await domainContract.getAddress(domain);
  console.log("Owner of domain Sidoux: ", address);

  const balance = await hre.ethers.provider.getBalance(domainContract.address);
  console.log("Contract balance:", hre.ethers.utils.formatEther(balance));
}


// async function verify(contractAddress, args) {
const verify = async (contractAddress, args) => {
  console.log("Verifying contract...")
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    })
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified!")
    } else {
      console.log(e)
    }
  }
}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();