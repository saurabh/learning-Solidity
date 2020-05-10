const Web3 = require('web3');

// Start talking to ganache via http.
let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));

// Get balance of one of the Ganache addresses.
web3.eth
  .getBalance('0x4Ae69D8AF7642A285d9F3c69a3306CE6AA828248')
  .then((result) => console.log(web3.utils.fromWei(result, 'ether')));

// Transfer Eth from one address to another
web3.eth.sendTransaction({
  from: '0x4Ae69D8AF7642A285d9F3c69a3306CE6AA828248',
  to: '0xD8c04Ebb22beBcdcA8717A58ADBcbF2c3EF20DE4',
  value: web3.utils.toWei('1', 'ether'),
});


// Calling a smart contract function directly from web3:
// lets say we have a simple smart contract

contract SomeContract {
  uint public myUint = 10;
  function setUint(uint _myUint) public {
    myUint = _myUint;
  }
}

// Deploy this contract on remix after connecting to ganache and then hit the public myUint button. Review the call and copy the input hashed function signature from the input field into the data field below.

web3.eth.call({from: "fromAddress", to: "smartContractAddress", data: "0x06540f7e"}).then(console.log);

// calculating the hashed function signature directly using web3
web3.utils.sha3("myUint()"); // gives the full signature but we only need the first 4 bytes
web3.utils.sha3("myUint()").substr(0,10); 

// now we can just use this in our previous call
web3.eth.call({from: "fromAddress", to: "smartContractAddress", data: web3.utils.sha3("myUint()").substr(0,10)}).then(console.log);



// A better way of doing what we did above is to actually get the whole contract object replicated using the ABI array and the contract address.
let contract = new web3.eth.Contract(ABI array, Address);

// Then you can just call it directly
contract.methods.myUint().call().then(console.log); // will return 10 using the SomeContract from above.
// Calling the setUint function
contract.methods.setUint(59).send({from: "fromAddress"}).then(console.log);


