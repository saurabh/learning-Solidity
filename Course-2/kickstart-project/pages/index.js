// import React, { useEffect } from 'react';
import React, { Component } from 'react';
import factoryInstance from '../factory';

class Index extends Component {
  async componentDidMount() {
    const campaigns = await factoryInstance.methods.getDeployedCampaigns().call();
    console.log(campaigns)
  }

  render() {
    return <div>Campaign</div>
  }
}

// function Index() {
//   useEffect(() => {
//     async function asyncCalls() {
//       const campaigns = await factoryInstance.methods.getDeployedCampaigns().call();
//       console.log(campaigns);
//     }
    
//     asyncCalls();
//   }, [])

//   return (
//     <>
//       Test
//     </>
//   )
// }

export default Index;