import Web3 from 'web3';
require('dotenv').config();

let web3;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
  // We are in the browser and metamask is running,
  web3 = new Web3(window.web3.currentProvider);
} else {
  // We are in the browser *OR* the user is not running metamask
  const provider = new Web3.providers.HttpProvider(
    `https://rinkeby.infura.io/v3/${process.env.INFURA_ID}` // Insert INFURA URL here
  );
  web3 = new Web3(provider);
}

export default web3;
