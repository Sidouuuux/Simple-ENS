const { expect } = require("chai");
describe("Domains contract", function () {
  let domainContract;
  let owner;
  let addr1;
  let addr2;

  const tld = "test";
  const registrationCost = hre.ethers.utils.parseEther('0.1');
  beforeEach(async function () {
    const Domains = await ethers.getContractFactory("Domains");
    domainContract = await Domains.deploy(tld);
    await domainContract.deployed();

    [owner, addr1, addr2] = await ethers.getSigners();
  });

  describe("Register", function () {
    it("should register a domain", async function () {
      const domainName = "example";

      // Register the domain
      const tx = await domainContract.connect(addr1).register(domainName, {
        value: registrationCost,
      });
      const receipt = await tx.wait();

      const address = await domainContract.getAddress(domainName);

      // Check the event emitted by the register function
      expect(address).to.equal(addr1.address);
    });

    it("should revert if the domain is already registered", async function () {
      const domainName = "example";
      // Register the domain
      await domainContract.connect(addr1).register(domainName, {
        value: registrationCost,
      });

      // Try to register the domain again
      await expect(
        domainContract.connect(addr2).register(domainName, {
          value: registrationCost,
        })
      ).to.be.revertedWithCustomError(domainContract, "DomainNotAvailable");
    });


    it("should revert if the registration cost is not enough", async function () {
      const domainName = "example";

      // Try to register the domain without providing the registration cost
      await expect(
        domainContract.connect(addr1).register(domainName, {
          value: hre.ethers.utils.parseEther('0.01'),
        })
      ).to.be.revertedWithCustomError(domainContract, "NotenoughMatic");
    });


  });
  describe("Price", function () {
    it("should return the correct registration cost for a domain", async function () {
      // Get the registration cost for a 3-character domain name
      const price1 = await domainContract.price("abc");
      expect(price1).to.equal(ethers.utils.parseEther("0.5"));

      // Get the registration cost for a 5-character domain name
      const price2 = await domainContract.price("abcd");
      expect(price2).to.equal(ethers.utils.parseEther("0.3"));

      // Get the registration cost for a 10-character domain name
      const price3 = await domainContract.price("abcdefghij");
      expect(price3).to.equal(ethers.utils.parseEther("0.1"));
    });
  });

  describe("Record", function () {
    it("should set a record for a registered domain by the owner", async function () {
      const record = "example.com";
      await domainContract.connect(addr1).register("example", {
        value: registrationCost,
      });

      await domainContract.connect(addr1).setRecord("example", record);
      const retrievedRecord = await domainContract.getRecord("example");
      expect(retrievedRecord).to.equal(record);
    });

    it("should revert if a non-owner tries to set a record for a registered domain", async function () {
      const record = "example.com";
      await domainContract.connect(addr1).register("example", {
        value: registrationCost,
      });

      await expect(
        domainContract.connect(addr2).setRecord("example", record)
      ).to.be.revertedWith("You are not the owner");
    });

    it("should revert if a record is set for an unregistered domain", async function () {
      const record = "example.com";
      await expect(
        domainContract.connect(owner).setRecord("example", record)
      ).to.be.revertedWith("You are not the owner");
    });
  });

  describe("withdraw", function () {
    it("should allow the owner to withdraw funds", async function () {
      // Register a domain
      const domainName = "example";
      await domainContract.connect(addr1).register(domainName, { value: registrationCost });

      // Get the initial balance of the contract
      const initialBalance = await ethers.provider.getBalance(domainContract.address);

      // Get the owner's initial balance
      const ownerBalance = await ethers.provider.getBalance(owner.address);

      // Calculate the expected amount to withdraw
      const expectedAmount = initialBalance.sub(registrationCost);

      // Withdraw the funds
      await domainContract.connect(owner).withdraw(owner.address)

      // Check that the contract's balance is now 0
      const newBalance = await ethers.provider.getBalance(domainContract.address);
      expect(newBalance).to.equal(0);
    });

  });
});
