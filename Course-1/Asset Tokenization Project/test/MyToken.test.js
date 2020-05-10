const Token = artifacts.require("MyToken");
require("dotenv").config({path: "../.env"});

const chai = require('./setupChai');
const BN = web3.utils.BN;
const expect = chai.expect;

contract("Token Test", async accounts => {
  const [ deployerAccount, recipient, anotherAccount ] = accounts;

  beforeEach(async () => {
    this.myToken = await Token.new(process.env.INITIAL_TOKENS);
  })

  it("All tokens should be in Owners account", async () => {
    let instance = this.myToken;
    let totalSupply = await instance.totalSupply();
    return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply);
  })
  
  it("is possible to transfer tokens between accounts", async () => {
    let instance = this.myToken;
    let totalSupply = await instance.totalSupply();
    expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply);
    expect(instance.transfer(recipient, 1)).to.eventually.be.fulfilled;
    expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply.sub(new BN(1)));
    return expect(instance.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(new BN(1));
  })
  
  it("is not possible to send more tokens than the total supply", async () => {
    let instance = this.myToken;
    let balanceOfDeployer = await instance.balanceOf(deployerAccount);
    expect(instance.transfer(recipient, new BN(balanceOfDeployer+1))).to.eventually.be.rejected;
    return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(balanceOfDeployer);
  })
})

