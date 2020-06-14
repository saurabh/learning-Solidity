import Link from 'next/link';
import Layout from '../../../../components/Layout';
import { Grid, Button } from 'semantic-ui-react';
import factoryConstructor from '../../../../factory';
import campaignConstructor from '../../../../campaign';
import ContributeForm from '../../../../components/ContributeForm';

const RequestsIndex = ({ address }) => {

  return (
    <Layout>
      <h3>Requests Index Page</h3>
      <Grid>
        <Grid.Row>
          <Grid.Column width={12}></Grid.Column>
          <Grid.Column>
            <ContributeForm campaignAddress={address} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Link href={`/campaigns/${address}/requests/new`}>
              <a>
                <Button primary>Create Request</Button>
              </a>
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>

    </Layout>
  );
};

export async function getStaticProps({ params }) {
  // const campaign = await campaignConstructor(params.campaign);

  return {
    props: {
      address: params.campaign
    }
  };
}

export async function getStaticPaths() {
  let factoryInstance = await factoryConstructor();
  const campaigns = await factoryInstance.methods.getDeployedCampaigns().call();

  const paths = campaigns.map((address) => `/campaigns/${address}/requests`);

  return { paths, fallback: false };
}

export default RequestsIndex;
