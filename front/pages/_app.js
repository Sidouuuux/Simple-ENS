import '../styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
  lightTheme
} from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { polygonMumbai } from 'wagmi/chains';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

const { chains, provider } = configureChains(
  [polygonMumbai],
  [
    jsonRpcProvider({
      rpc: chain => ({
        http: 'https://rpc.ankr.com/polygon_mumbai',
      }),
    }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'Sidoux ENS',
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

function MyApp({ Component, pageProps }) {

  return (<WagmiConfig client={wagmiClient}>
    <RainbowKitProvider
      coolMode
      modalSize="compact"
      chains={chains}
      theme={lightTheme({
        accentColor: '#7b3fe4',
        accentColorForeground: 'white',
        borderRadius: 'large',
        fontStack: 'system',
        overlayBlur: 'small',
      })}
    >
      <Component {...pageProps} />
    </RainbowKitProvider>
  </WagmiConfig>)
}

export default MyApp
