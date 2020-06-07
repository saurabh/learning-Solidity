import { useStateValue } from '../state';
import { Menu } from 'semantic-ui-react';
import addrShortener from '../utils/addrShortener';

const Header = () => {
  const [{ dapp }, dispatch] = useStateValue();

  return (
    <Menu style={{ marginTop: '10px' }}>
      <Menu.Item>EthStarter</Menu.Item>
      <Menu.Menu position='right'>
        <Menu.Item>Campaigns</Menu.Item>
        <Menu.Item>+</Menu.Item>
        <Menu.Item>
          {dapp.balance < 0 ? 'Sign In' : addrShortener(dapp.address)}
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
};

export default Header;
