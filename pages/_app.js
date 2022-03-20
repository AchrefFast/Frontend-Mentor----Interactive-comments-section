import "../styles/globals.scss";
import { AppContextProvider } from '../components/store/app-context'
function MyApp({ Component, pageProps }) {
  return (
    <AppContextProvider>
      <Component {...pageProps} />
    </AppContextProvider>
  );
}

export default MyApp;
