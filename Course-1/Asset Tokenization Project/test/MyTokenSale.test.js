const TokenSale = artifacts.require("MyTokenSale");
const Token = artifacts.require("MyToken");
const KycContract = artifacts.require("KycContract");
require("dotenv").config({path: "../.env"});

const chai = require('./setupChai');
const BN = web3.utils.BN;
const expect = chai.expect;

contract("TokenSale Test", async accounts => {
  const [ deployerAccount, recipient, anotherAccount ] = accounts;

  it('should not have any tokens left in the deployerAccount', async () => {
    let instance = await Token.deployed();
    return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(new BN(0));
  })
  
  it('all tokens should be in the TokenSale Smart contract by default', async () => {
    let instance = await Token.deployed();
    let balanceOfTokenSaleContract = await instance.balanceOf(TokenSale.address);
    let totalSupply = await instance.totalSupply();
    return expect(balanceOfTokenSaleContract).to.be.a.bignumber.equal(totalSupply);
  })
  
  it('should be possible to buy tokens', async () => {
    let tokenInstance = await Token.deployed();
    let tokenSaleInstance = await TokenSale.deployed();
    let kycInstance = await KycContract.deployed();
    let balanceBefore = await tokenInstance.balanceOf(anotherAccount);
    await kycInstance.setKycCompleted(anotherAccount, {from: deployerAccount});
    expect(tokenSaleInstance.sendTransaction({from: anotherAccount, value: web3.utils.toWei("1", "wei")})).to.be.fulfilled;
    return expect(tokenInstance.balanceOf(anotherAccount)).to.eventually.be.a.bignumber.equal(balanceBefore.add(new BN(1)));
  })
})

