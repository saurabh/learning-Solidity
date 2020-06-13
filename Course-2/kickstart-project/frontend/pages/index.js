import { useStateValue } from '../state';
import Link from 'next/link';
import Layout from '../components/Layout';
import factoryConstructor from '../factory';
import { Card, Button } from 'semantic-ui-react';

const Index = ({ campaigns }) => {
  const [{ dapp }, dispatch] = useStateValue();

  const renderCampaigns = () => {
    const items = campaigns.map((address) => {
      return {
        header: address,
        description: (
          <Link href='/campaigns/[campaign]' as={`/campaigns/${address}`}>
            <a>View Campaign</a>
          </Link>
        ),
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
