import { useState } from 'react';
import { useRouter } from 'next/router';
import { useStateValue } from '../state';
import { Form, Input, Button, Message } from 'semantic-ui-react';
import campaignConstructor from '../campaign';

const ContributeForm = ({ campaignAddress }) => {
  const router = useRouter();
  const [{ dapp }, dispatch] = useStateValue();
  const [value, setValue] = useState('');
  const [errorMessage, setError] = useState('');
  const [loading, isLoading] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const campaign = await campaignConstructor(campaignAddress);

    isLoading(true);
    setError('');

    try {
      await campaign.methods
        .contribute()
        .send({
          value: dapp.web3.utils.toWei(value, 'ether'),
          from: dapp.address
        })
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
          router.replace(`/campaigns/${campaignAddress}`);
        });
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 5000);
    }

    setValue('');
    isLoading(false);
  };

  return (
    <Form onSubmit={handleFormSubmit} error={!!errorMessage}>
      <Form.Field>
        <label>Minimum Contribution</label>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          label='ether'
          labelPosition='right'
        />
        <Message error header='Oops!' content={errorMessage} />
        {' '}
      </Form.Field>
      <Button loading={loading} primary>
        Contribute!
      </Button>
    </Form>
  );
};

export default ContributeForm;
