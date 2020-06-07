import React, { useState, useEffect } from 'react';
import { useStateValue } from '../state';
import web3 from '../utils/getWeb3';
import factoryInstance from '../factory';
import Layout from '../components/Layout'
import { Card, Button } from 'semantic-ui-react';

const Index = ({ campaigns }) => {
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
      setInterval(async function () {
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

    dispatchDapp();
  }, [dapp.web3, dapp.address, dapp.balance]);

  const renderCampaigns = () => {
    const items = campaigns.map((address) => {
      return {
        header: address,
        description: <a>View Campaign</a>,
        fluid: true
      };
    });

    return <Card.Group items={items} />;
  };

  return (
    <Layout>
      <h3>Open Campaigns</h3>
      <Button content='Create Campaign' icon='add circle' primary floated='right'/>
      {renderCampaigns()}
    </Layout>
  );
};

export async function getStaticProps() {
  const campaigns = await factoryInstance.methods.getDeployedCampaigns().call();

  return {
    props: { campaigns }
  };
}

export default Index;
