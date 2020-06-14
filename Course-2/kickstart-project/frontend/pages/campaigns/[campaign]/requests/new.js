import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useStateValue } from '../../../../state';
import Layout from '../../../../components/Layout';
import { Form, Button, Message, Input } from 'semantic-ui-react';
import factoryConstructor from '../../../../factory';
import campaignConstructor from '../../../../campaign';

const NewRequest = ({ address }) => {
  const router = useRouter();
  const [{ dapp }, dispatch] = useStateValue();
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [recipient, setRecipient] = useState('');
  const [errorMessage, setError] = useState('');
  const [loading, isLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    isLoading(true);
    setError('');
    const campaign = await campaignConstructor(address);

    try {
      await campaign.methods
        .createRequest(description, dapp.web3.utils.toWei(value, 'wei'), recipient)
        .send({ from: dapp.address })
        .on('transactionHash', () => {
          dispatch({
            type: 'SET_CURRENTLY_MINING',
            payload: true
          });
        })
        .on('receipt', () => {
          dispatch({
            type: 'SET_CURRENTLY_MINING',
            payload: false
          });
        });

      router.push(`/campaigns/${address}/requests`);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 5000);
    }
    isLoading(false);
  };

  return (
    <Layout>
      <Link href={`/campaigns/${address}/requests`}>
        <a>
          <Button primary>Back</Button>
        </a>
      </Link>
      <h3>Create a Request</h3>
      <Form onSubmit={onSubmit} error={!!errorMessage}>
        <Form.Field>
          <label>Description</label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Value in Ether</label>
          <Input value={value} onChange={(e) => setValue(e.target.value)} />
        </Form.Field>
        <Form.Field>
          <label>Recipient</label>
          <Input
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
        </Form.Field>
        <Message error header='Oops!' content={errorMessage} />
        <Button loading={loading} primary>Create!</Button>
      </Form>
    </Layout>
  );
};

export async function getStaticProps({ params }) {
  return {
    props: {
      address: params.campaign
    }
  };
}

export async function getStaticPaths() {
  let factoryInstance = await factoryConstructor();
  const campaigns = await factoryInstance.methods.getDeployedCampaigns().call();

  const paths = campaigns.map(
    (address) => `/campaigns/${address}/requests/new`
  );

  return { paths, fallback: false };
}

export default NewRequest;
