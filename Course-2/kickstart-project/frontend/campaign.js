import web3 from './utils/getWeb3';
import CampaignObject from './build/Campaign.json';

const campaignConstructor = (address) => {
  return new web3.eth.Contract(CampaignObject.abi, address);
}


export default campaignConstructor;
