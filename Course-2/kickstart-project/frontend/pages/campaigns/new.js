import { useState } from 'react';
import { useRouter } from 'next/router';
import { useStateValue } from '../../state';
import Layout from '../../components/Layout';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import factoryConstructor from '../../factory';

const NewCampaign = () => {
  const router = useRouter();
  const [{ dapp }, dispatch] = useStateValue();
  const [minimumContribution, setContribution] = useState('');
  const [errorMessage, setError] = useState('');
  const [loading, isLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    isLoading(true);
    setError('');
    let factoryInstance = await factoryConstructor();

    try {
      await factoryInstance.methods
      .createCampaign(dapp.web3.utils.toWei(minimumContribution, 'ether'))
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
      })
      .on('error', () => {
        dispatch({
          type: 'SET_CURRENTLY_MINING',
          payload: false
        });
      });

      router.push('/');
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 5000);
    }
    isLoading(false);
  };

  return (
    <Layout>
      <h3>Create a new Campaign</h3>
      <Form onSubmit={onSubmit} error={!!errorMessage}>
        <Form.Field>
          <Input
            label='ether'
            labelPosition='right'
            value={minimumContribution}
            onChange={(e) => setContribution(e.target.value)}
          />
        </Form.Field>
        <Message error header='Oops!' content={errorMessage} />
        <Button loading={loading} primary>Create!</Button>
      </Form>
    </Layout>
  );
};

export default NewCampaign;
