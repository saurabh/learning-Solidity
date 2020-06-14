import { useStateValue } from '../../../state';
import Link from 'next/link';
import web3 from '../../../utils/getWeb3';
import Layout from '../../../components/Layout.js';
import MiningIndicator from '../../../components/MiningIndicator';
import { Grid, Card, Button } from 'semantic-ui-react';
import factoryConstructor from '../../../factory';
import campaignConstructor from '../../../campaign';
import ContributeForm from '../../../components/ContributeForm';

const Campaign = ({
  address,
  minimumContribution,
  balance,
  requestsCount,
  approversCount,
  manager
}) => {
  const [{ dapp }, dispatch] = useStateValue();

  const renderCards = () => {
    const items = [
      {
        header: manager,
        meta: "Campaign Manager's Address",
        description:
          'The manager created this crowdfunding campaign and can create requests to withdraw money',
        style: { overflowWrap: 'break-word' }
      },
      {
        header: web3.utils.fromWei(minimumContribution, 'ether'),
        meta: 'Minimum Contribution (in ether)',
        description:
          'You must contribute at least this much ether to be a part of this crowdfunding campaign',
        style: { overflowWrap: 'break-word' }
      },
      {
        header: requestsCount,
        meta: 'Number of Requests',
        description:
          'A request tries to withdraw funds from the contract. Requests must be approved by campaign contributors.',
        style: { overflowWrap: 'break-word' }
      },
      {
        header: approversCount,
        meta: 'Number of Contributors',
        description:
          'The number of people who have already contributed to this crowdfunding campaign',
        style: { overflowWrap: 'break-word' }
      },
      {
        header: web3.utils.fromWei(balance, 'ether'),
        meta: 'Campaign Balance (in ether)',
        description: 'This is how much ether this campaign has raised',
        style: { overflowWrap: 'break-word' }
      }
    ];

    return <Card.Group items={items} />;
  };

  return (
    <Layout>
      {dapp.currentlyMining && (
        <div className='mining-state'>
          <span>Mining... &nbsp;</span>
          <MiningIndicator />
        </div>
      )}
      <h3>Campaign</h3>
      <Grid>
        <Grid.Column width={10}>
          {renderCards()}
          <Link href='/campaigns/[campaign]/requests' as={`/campaigns/${address}/requests`}>
            <a>
              <Button primary>View Requests</Button>
            </a>
          </Link>
        </Grid.Column>
        <Grid.Column width={6}>
          <ContributeForm campaignAddress={address} />
        </Grid.Column>
      </Grid>
    </Layout>
  );
};

export async function getStaticProps({ params }) {
  let campaign = await campaignConstructor(params.campaign);
  const campaignSummary = await campaign.methods.getSummary().call();

  return {
    props: {
      address: params.campaign,
      minimumContribution: campaignSummary[0],
      balance: campaignSummary[1],
      requestsCount: campaignSummary[2],
      approversCount: campaignSummary[3],
      manager: campaignSummary[4]
    }
  };
}

export async function getStaticPaths() {
  let factoryInstance = await factoryConstructor();
  const campaigns = await factoryInstance.methods.getDeployedCampaigns().call();

  const paths = campaigns.map((address) => `/campaigns/${address}`);

  return { paths, fallback: false };
}

export default Campaign;
