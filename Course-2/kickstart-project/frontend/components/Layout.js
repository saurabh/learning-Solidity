import dynamic from 'next/dynamic'
import { Container } from 'semantic-ui-react';
const Header = dynamic(() => import('../components/Header'), { ssr: false })

export default ({ children }) => {
  return (
    <>
      <Header />
      <Container>
        <main>{children}</main>
      </Container>
    </>
  );
};
