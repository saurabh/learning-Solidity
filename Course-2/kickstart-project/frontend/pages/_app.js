import { StateProvider } from '../state';
import InitialState from '../state/initialState';
import Reducer from '../state/reducer';

function MyApp({ Component, pageProps }) {
  return (
    <StateProvider initialState={InitialState} reducer={Reducer}>
      <Component {...pageProps} />
    </StateProvider>
  );
}

export default MyApp;
