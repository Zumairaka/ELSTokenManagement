/* global BigInt */
import './App.css';
import { useAccount, useConnect, usePrepareContractWrite, useContractWrite } from 'wagmi';
// import { serialize, deserialize } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { useState, useEffect } from 'react';
import ABI from "./contract-abi.json";

function App() {
  // const [error, setError] = useState(false);
  // const [balance, seBalance] = useState("");
  const [amount, setAmount] = useState("");

  // connect metamask
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new MetaMaskConnector()
  });

  // set amount event
  function changeSetAmount(e) {
    setAmount(e.target.value);
  }

  // prepare send tokens
  const { config } = usePrepareContractWrite({
    address: "0x324C0660A0bD25D70EA720db81075e7c4aF75B54",
    abi: ABI,
    chainId: 11155111,
    functionName: "sendToken(uint256)",
    args: [amount],
  });

  const { data: hash, write: sendToken } = useContractWrite(config);

  return (
    <div className="App">
      <header className="App-header">
        <img src='ethlas-thumb.webp' className='app-img' alt="app-img" />
        <div className="title">
          ELS Token Management
        </div>
        {isConnected ? (
          <div>
            <h3 className='address-title'>Connected Wallet</h3>
            <h4 className='address'>{address}</h4>
            <input
              type='text'
              value={amount}
              onChange={changeSetAmount}
              className='amount'
              placeholder='1000000000000000000'>
            </input>
            <div className='buttons'>
              <button className='send' onClick={() => sendToken?.()}>Send</button>
              <button className='withdraw'>Withdraw</button>
            </div>
          </div>
        ) : (
          <img src="metamask.png" onClick={connect} className="metamask" alt="metamask" />
        )}
      </header >
    </div >
  );
}

export default App;
