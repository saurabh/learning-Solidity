import React, { useState, useEffect } from 'react';
import { useStateValue } from '../state';
import web3 from '../utils/getWeb3';
import addrShortener from '../utils/addrShortener';
import factoryInstance from '../factory';

const Index = () => {
  const [{ dapp }, dispatch] = useStateValue();

  useEffect(() => {
    async function dispatchDapp() {
      dispatch({
        type: 'SET_WEB3',
        payload: web3
      });
      let [address] = await web3.eth.getAccounts();
      dispatch({
        type: 'SET_ADDRESS',
        payload: address
      });
      const network = await web3.eth.net.getId();
      dispatch({
        type: 'SET_NETWORK',
        payload: network
      });
      const balance = await web3.eth.getBalance(address);
      dispatch({
        type: 'SET_BALANCE',
        payload: balance
      });
      // refreshes the dapp when a different address is selected in metamask
      setInterval(async function() {
        let [addressCheck] = await web3.eth.getAccounts();
        if (addressCheck !== address) {
          address = addressCheck;
          dispatch({
            type: 'SET_ADDRESS',
            payload: address
          });
        }
      }, 100);
    }
    
    async function asyncCalls() {
      const campaigns = await factoryInstance.methods.getDeployedCampaigns().call();
      console.log(campaigns);
    }
    
    asyncCalls();
    dispatchDapp();
  }, [dapp.web3, dapp.address, dapp.balance]);
  
  return (
    <>
      { dapp.address && addrShortener(dapp.address) }
      <hr/>
      { dapp.web3 ? dapp.web3.utils.fromWei(String(dapp.balance), 'ether') : dapp.balance }
    </>
  )
}

export default Index;