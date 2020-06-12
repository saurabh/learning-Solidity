import web3 from './utils/getWeb3';
import CampaignFactoryObject from './build/CampaignFactory.json';
const address = '0xDBB3d41F91aEBdDAF0d01e8D041d776248cc2849';

const factoryConstructor = async () => {
  return new web3.eth.Contract(CampaignFactoryObject.abi, address);
}


export default factoryConstructor;
