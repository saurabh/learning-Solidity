import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined') {
  // Modern dapp browsers...
  if (typeof window.ethereum !== 'undefined') {
    // Request account access if needed
    window.ethereum.enable();
    web3 = new Web3(window.ethereum);
  }
  // Legacy dapp browsers...
  if (typeof window.web3 !== 'undefined') {
    web3 = new Web3(window.web3.currentProvider);
  }
} else {
  // We are in the browser *OR* the user is not running metamask
  const provider = new Web3.providers.HttpProvider(
    `https://rinkeby.infura.io/v3/${process.env.INFURA_ID}` // Insert INFURA URL here
  );
  web3 = new Web3(provider);
}

export default web3;
