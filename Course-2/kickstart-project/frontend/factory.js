import web3 from './utils/getWeb3';
import CampaignFactoryObject from './build/CampaignFactory.json';
const address = '0x19046f91357Ff5fa028634f092B1f8F1E82d4350';

const factoryConstructor = () => {
  return new web3.eth.Contract(CampaignFactoryObject.abi, address);
}


export default factoryConstructor;
