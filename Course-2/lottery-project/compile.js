const path = require('path');
const fs = require('fs');
const solc = require('solc');

const lotteryPath = path.resolve(__dirname, 'contracts', 'Lottery.sol');
const source = fs.readFileSync(lotteryPath, 'utf8');

const input = {
  language: "Solidity",
  sources: {
    "Lottery.sol": {
      content: source
    }
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ['*']
      }
    }
  }
}

const output = JSON.parse(solc.compile(JSON.stringify(input)));

for (var contractName in output.contracts['Lottery.sol']) {
  module.exports = output.contracts['Lottery.sol'][contractName];
}

// for (var contractName in output.contracts['Lottery.sol']) {
//   console.log(output.contracts['Lottery.sol'][contractName].evm.bytecode.object); //Bytecode
//   console.log(output.contracts['Lottery.sol'][contractName].abi); // interface
// }