import { useState } from 'react';
import { useStateValue } from '../../state';
import Layout from '../../components/Layout';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import MiningIndicator from '../../components/MiningIndicator.js'
import factoryInstance from '../../factory';

const NewCampaign = () => {
  const [{ dapp }, dispatch] = useStateValue();
  const [minimumContribution, setContribution] = useState('');
  const [errorMessage, setError] = useState('');

  const onSubmit = async (e) => {
    try {
    e.preventDefault();
    await factoryInstance.methods.createCampaign(dapp.web3.utils.toWei(minimumContribution, 'ether')).send({ from: dapp.address });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Layout>
      {dapp.currentlyMining && (
        <div className="mining-state">
          <span>Mining... &nbsp;</span>
          <MiningIndicator />
        </div>
      )}
      <h3>Create a new Campaign</h3>
      <Form onSubmit={onSubmit} error={errorMessage}>
        <Form.Field>
          <Input
            label='ether'
            labelPosition='right'
            value={minimumContribution}
            onChange={(e) => setContribution(e.target.value)}
          />
        </Form.Field>
        <Message 
          error
          header="Oops!"
          content={errorMessage}
        />
        <Button primary>Create!</Button>
      </Form>
      <style jsx>{`
        .mining-state {
          position: absolute;
          right: 0;
          display: flex;
          padding: 10px 10px 0 0;
        }
      `}</style>
    </Layout>
  );
};

export default NewCampaign;
