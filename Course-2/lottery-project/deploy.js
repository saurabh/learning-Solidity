const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { abi, evm } = require('./compile');
const bytecode = evm.bytecode.object;
require('dotenv').config();

const provider = new HDWalletProvider(
  `${process.env.MNEMONIC}`,
  `https://rinkeby.infura.io/v3/${process.env.INFURA_ID}`
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log(`Deploying from ${accounts[0]}`);

  const result = await new web3.eth.Contract(abi)
    .deploy({ data: '0x' + bytecode }) // add 0x bytecode
    .send({ from: accounts[0] }); // remove 'gas'

  console.log(abi);
  console.log('Contract deployed to: ', result.options.address);
};

deploy();
