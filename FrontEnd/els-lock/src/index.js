import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createClient, configureChains, WagmiConfig } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { infuraProvider } from "wagmi/providers/infura";

const { provider, webSocketProvider } = configureChains(
  [mainnet, sepolia],
  [infuraProvider({ apiKey: process.env.API_KEY })]
)

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <WagmiConfig client={client}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </WagmiConfig>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
