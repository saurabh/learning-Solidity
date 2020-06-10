import web3 from './utils/getWeb3';
import CampaignFactoryObject from './build/CampaignFactory.json';
const address = '0x78cf587217A3C4f0cFA30598AC34DDD4C20Bf69A';

const factoryConstructor = async () => {
  return new web3.eth.Contract(CampaignFactoryObject.abi, address);
}


export default factoryConstructor;
