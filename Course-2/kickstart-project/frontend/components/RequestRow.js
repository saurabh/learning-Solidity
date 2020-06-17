import { useRouter } from 'next/router';
import { useStateValue } from '../state';
import { Table, Button } from 'semantic-ui-react';
import campaignConstructor from '../campaign';

const RequestRow = ({ id, request, campaignAddress, approversCount }) => {
  const router = useRouter();
  const [{ dapp }, dispatch] = useStateValue();

  const { Row, Cell } = Table;
  const { description, value, recipient, complete, approvalCount } = request;
  const readyToFinalize = approvalCount >= (approversCount / 2);

  const onApprove = async () => {
    const campaign = await campaignConstructor(campaignAddress);
    await campaign.methods
      .approveRequest(id)
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
        router.replace(`/campaigns/${campaignAddress}/requests`);
      })
      .on('error', () => {
        dispatch({
          type: 'SET_CURRENTLY_MINING',
          payload: false
        });
      });
  };

  const onFinalize = async () => {
    const campaign = await campaignConstructor(campaignAddress);
    await campaign.methods
      .finalizeRequest(id)
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
        router.replace(`/campaigns/${campaignAddress}/requests`);
      })
      .on('error', () => {
        dispatch({
          type: 'SET_CURRENTLY_MINING',
          payload: false
        });
      });
  };

  return (
    <Row disabled={complete} positive={readyToFinalize && !complete}>
      <Cell>{id}</Cell>
      <Cell>{description}</Cell>
      <Cell>{dapp.web3.utils.fromWei(value, 'ether')}</Cell>
      <Cell>{recipient}</Cell>
      <Cell>
        {approvalCount}/{approversCount}
      </Cell>
      <Cell>
        {complete ? null : (
          <Button color='green' basic onClick={onApprove}>
            Approve
          </Button>
        )}
      </Cell>
      <Cell>
        {complete ? null : (
          <Button primary basic onClick={onFinalize}>
            Finalize
          </Button>
        )}
      </Cell>
    </Row>
  );
};

export default RequestRow;
