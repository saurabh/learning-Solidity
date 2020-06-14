import Link from 'next/link';
import web3 from '../../../utils/getWeb3';
import Layout from '../../../components/Layout.js';
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
      <h3>Campaign</h3>
      <Grid>
        <Grid.Row>
          <Grid.Column width={12}>{renderCards()}</Grid.Column>
          <Grid.Column width={4}>
            <ContributeForm campaignAddress={address} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Link href={`/campaigns/${address}/requests`}>
              <a>
                <Button primary>View Requests</Button>
              </a>
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Layout>
  );
};

export async function getStaticProps({ params }) {
  const campaign = await campaignConstructor(params.campaign);
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
  const factoryInstance = await factoryConstructor();
  const campaigns = await factoryInstance.methods.getDeployedCampaigns().call();

  const paths = campaigns.map((address) => `/campaigns/${address}`);

  return { paths, fallback: false };
}

export default Campaign;
