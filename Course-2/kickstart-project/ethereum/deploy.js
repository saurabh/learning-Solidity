require('dotenv').config({ path: '../.env' });
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const campaignFactoryObject = require('./build/CampaignFactory.json');

const provider = new HDWalletProvider(
  `${process.env.MNEMONIC}`,
  `https://rinkeby.infura.io/v3/${process.env.INFURA_ID}`
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log(`Deploying from ${accounts[0]}`);

  const txn = await new web3.eth.Contract(campaignFactoryObject.abi)
    .deploy({ data: '0x' + campaignFactoryObject.evm.bytecode.object }) // add 0x bytecode
    .send({ from: accounts[0] }); // remove 'gas'

  console.log('Contract deployed to: ', txn.options.address); // Deployed to 0x78cf587217A3C4f0cFA30598AC34DDD4C20Bf69A on Rinkeby
};

deploy();
