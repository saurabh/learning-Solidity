const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const provider = ganache.provider({ gasLimit: 10000000 });
const web3 = new Web3(provider);
const campaignFactoryObject = require('../ethereum/build/CampaignFactory.json');
const campaignObject = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(campaignFactoryObject.abi)
    .deploy({ data: campaignFactoryObject.evm.bytecode.object })
    .send({ from: accounts[0], gas: '10000000' });

  await factory.methods
    .createCampaign('100')
    .send({ from: accounts[0], gas: '1000000' });

  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
  campaign = await new web3.eth.Contract(campaignObject.abi, campaignAddress);
});

describe('Campaigns', () => {
  it('deploys a factory and a campaign', () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it('sets the caller as the campaign manager', async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(manager, accounts[0]);
  });

  it('allows people to contribute and marks them as approvers', async () => {
    await campaign.methods.contribute().send({
      from: accounts[1],
      value: '200'
    });
    const isContributor = await campaign.methods.approvers(accounts[1]).call();
    assert(isContributor);
  });

  it('requires a minimum contribution', async () => {
    try {
      await campaign.methods.contribute().send({
        from: accounts[1],
        value: '10'
      });
      assert(false); // if the previous contribute does NOT give an error, this line will make sure the test fails.
    } catch (err) {
      assert(err); // this line checks to make sure there is an error present in the try block, if there is then the test will pass.
    }
  });

  it('allows the manager to make a payment request', async () => {
    await campaign.methods.contribute().send({
      from: accounts[1],
      value: '200'
    });

    await campaign.methods
      .createRequest('Buy batteries', '100', accounts[2])
      .send({
        from: accounts[0],
        gas: '1000000'
      });
    const request = await campaign.methods.requests(0).call();
    assert.equal('Buy batteries', request.description);
  });

  it('processes requests', async () => {
    await campaign.methods.contribute().send({
      from: accounts[1],
      value: web3.utils.toWei('10', 'ether')
    });

    await campaign.methods
      .createRequest(
        'Buy Ethereum Tshirts',
        web3.utils.toWei('5', 'ether'),
        accounts[2]
      )
      .send({
        from: accounts[0],
        gas: '1000000'
      });

    await campaign.methods.approveRequest(0).send({
      from: accounts[1],
      gas: '1000000'
    });

    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: '1000000'
    });

    let vendorBalance = await web3.eth.getBalance(accounts[2]);
    vendorBalance = web3.utils.fromWei(vendorBalance, 'ether');
    vendorBalance = parseFloat(vendorBalance);

    assert(vendorBalance === 105);
  });
});
