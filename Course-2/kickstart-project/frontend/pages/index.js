import React, { useState, useEffect } from 'react';
import { useStateValue } from '../state';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import getWeb3 from '../utils/getWeb3';
import factoryConstructor from '../factory';
const Layout = dynamic(() => import('../components/Layout'), { ssr: false })
import { Card, Button } from 'semantic-ui-react';

const Index = ({ campaigns }) => {
  const [{ dapp }, dispatch] = useStateValue();

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
      <Link href='/campaigns/new'>
        <a>
          <Button
            content='Create Campaign'
            icon='add circle'
            primary
            floated='right'
          />
        </a>
      </Link>
      {renderCampaigns()}
    </Layout>
  );
};

export async function getStaticProps() {
  let factoryInstance = await factoryConstructor();
  const campaigns = await factoryInstance.methods.getDeployedCampaigns().call();

  return {
    props: { campaigns }
  };
}

export default Index;
