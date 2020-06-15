import Link from 'next/link';
import Layout from '../../../../components/Layout';
import { Button, Table } from 'semantic-ui-react';
import factoryConstructor from '../../../../factory';
import campaignConstructor from '../../../../campaign';
import ContributeForm from '../../../../components/ContributeForm';
import RequestRow from '../../../../components/RequestRow';

const RequestsIndex = ({ campaignAddress, requests, requestsCount, approversCount }) => {
  const { Header, Row, HeaderCell, Body } = Table;

  const renderRows = () => {
    return requests.map((request, index) => {
      return (
        <RequestRow
          key={index}
          id={index}
          request={request}
          approversCount={approversCount}
          campaignAddress={campaignAddress}
        />
      );
    });
  };

  return (
    <Layout>
      <h3>Requests</h3>
      <Link href={`/campaigns/${campaignAddress}/requests/new`}>
        <a>
          <Button primary floated='right' style={{ marginBottom: 10 }}>
            Create Request
          </Button>
        </a>
      </Link>
      <Table>
        <Header>
          <Row>
            <HeaderCell>ID</HeaderCell>
            <HeaderCell>Description</HeaderCell>
            <HeaderCell>Amount</HeaderCell>
            <HeaderCell>Recipient</HeaderCell>
            <HeaderCell>Approval Count</HeaderCell>
            <HeaderCell>Approve</HeaderCell>
            <HeaderCell>Finalize</HeaderCell>
          </Row>
        </Header>
        <Body>{renderRows()}</Body>
      </Table>
      <div>Found {requestsCount} requests</div>
    </Layout>
  );
};

export async function getStaticProps({ params }) {
  const campaign = await campaignConstructor(params.campaign);
  const requestsCount = await campaign.methods.getRequestsCount().call();
  const approversCount = await campaign.methods.approversCount().call();
  const requests = [];

  for (let i = 0; i < parseInt(requestsCount); i++) {
    let request = await campaign.methods.requests(i).call();
    requests.push(request);
  }

  // Course solution (seems complicated but I'll leave it here)
  // const requests = await Promise.all(
  //   Array(parseInt(requestsCount))
  //     .fill()
  //     .map((element, index) => {
  //       return campaign.methods.requests(index).call();
  //     })
  // );

  return {
    props: {
      campaignAddress: params.campaign,
      requestsCount,
      approversCount,
      requests: JSON.parse(JSON.stringify(requests))
      // Need to do this ^ due to the reason mentioned below. See https://github.com/vercel/next.js/issues/11993#issuecomment-617937409 for more info

      // The main reasoning behind this limitation is that with getInitialProps we used to allow anything that can be stringified and that resulted in some really hard to track down UX bugs when hydrating client-side. Eg the hydration would fail because suddenly the Date object you had server-side is a string client-side.
      // We need to serialize the result of getStaticProps/getServerSideProps because it has to be sent to the browser to do hydration.
      // So we basically went with a strict checking mechanism (only runs in development) in order to prevent this from happening. We can potentially  add an option to bypass in the future if there's enough need for it 👍
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
