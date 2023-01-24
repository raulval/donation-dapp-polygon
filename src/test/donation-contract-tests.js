const { assert } = require("chai");
const { ethers } = require("ethers");
const DonationContract = artifacts.require("../contracts/DonationContract.sol");
require("chai").use(require("chai-as-promised")).should();

contract("DonationContract", ([deployer, author, donator]) => {
  let donationContract;
  before(async () => {
    donationContract = await DonationContract.deployed();
  });

  describe("deployment", () => {
    it("should be an instance of DonationContract", async () => {
      const address = await donationContract.address;
      assert.notEqual(address, null);
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, undefined);
    });
  });

  describe("Images", () => {
    let result;
    const hash = "abcd1234";
    const description = "This is a test image";
    let imageCount;
    before(async () => {
      result = await donationContract.uploadImage(hash, description, {
        from: author,
      });
      imageCount = await donationContract.imageCount();
    });

    it("Check Image", async () => {
      let image = await donationContract.images(1);
      assert.equal(imageCount, 1);
      const event = result.logs[0].args;
      assert.equal(event.hash, hash);
      assert.equal(event.description, description);
    });

    it("Allow users to donate", async () => {
      let oldAuthorBalance;
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      oldAuthorBalance = await provider.getBalance(author);
      // format to bigNumber using ethers
      oldAuthorBalance = ethers.BigNumber.from(oldAuthorBalance);
      // oldAuthorBalance = new web3.utils.BN(oldAuthorBalance);
      result = await donationContract.donateImageOwner(imageCount, {
        from: donator,
        value: ethers.utils.formatUnits("1", "wei"),
        // value: web3.utils.toWei("1", "Ether"),
      });

      const event = result.logs[0].args;
      let newAuthorBalance;
      newAuthorBalance = await provider.getBalance(author);
      newAuthorBalance = ethers.BigNumber.from(newAuthorBalance);

      let donateImageOwner;
      donateImageOwner = ethers.utils.formatUnits("1", "wei");
      donateImageOwner = ethers.BigNumber.from(donateImageOwner);

      const expectedBalance = oldAuthorBalance.add(donateImageOwner);
      assert.equal(newAuthorBalance.toString(), expectedBalance.toString());
    });
  });
});
