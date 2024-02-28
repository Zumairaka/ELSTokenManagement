/* global BigInt */
import './App.css';
import { useAccount, useConnect, usePrepareContractWrite, useContractWrite, useBalance } from 'wagmi';
// import { serialize, deserialize } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { useState, useEffect } from 'react';
// import ABI from "./contract-abi.json";

function App() {
    const abi = [
        {
            "inputs": [],
            "name": "InvalidInitialization",
            "type": "error"
        },
        {
            "inputs": [],
            "name": "NotEnoughTokensToSend",
            "type": "error"
        },
        {
            "inputs": [],
            "name": "NotEnoughTokensToWithdraw",
            "type": "error"
        },
        {
            "inputs": [],
            "name": "NotInitializing",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                }
            ],
            "name": "OwnableInvalidOwner",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "account",
                    "type": "address"
                }
            ],
            "name": "OwnableUnauthorizedAccount",
            "type": "error"
        },
        {
            "inputs": [],
            "name": "ReentrancyGuardReentrantCall",
            "type": "error"
        },
        {
            "inputs": [],
            "name": "ZeroAddress",
            "type": "error"
        },
        {
            "inputs": [],
            "name": "ZeroAmount",
            "type": "error"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint64",
                    "name": "version",
                    "type": "uint64"
                }
            ],
            "name": "Initialized",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "previousOwner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "newOwner",
                    "type": "address"
                }
            ],
            "name": "OwnershipTransferred",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "token",
                    "type": "address"
                }
            ],
            "name": "TokenAddressUpdated",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "TokensSent",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "account",
                    "type": "address"
                }
            ],
            "name": "getBalance",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getToken",
            "outputs": [
                {
                    "internalType": "contract IERC20",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "token_",
                    "type": "address"
                }
            ],
            "name": "initializeLocking",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "renounceOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "sendToken",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "newOwner",
                    "type": "address"
                }
            ],
            "name": "transferOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "token",
                    "type": "address"
                }
            ],
            "name": "updateToken",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "withdrawToken",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ];
    // const [error, setError] = useState(false);
    const [amount, setAmount] = useState("");

    // connect metamask
    const { address, isConnected } = useAccount();
    const { connect } = useConnect({
        connector: new MetaMaskConnector()
    });

    // fetch balance
    const { data: balanceData } = useBalance({
        address: address
    });

    // useEffect
    useEffect(() => {
        if (isConnected) {

        }
    }, [isConnected]);

    // prepare send tokens
    const { config } = usePrepareContractWrite({
        address: "0x324C0660A0bD25D70EA720db81075e7c4aF75B54",
        abi: abi,
        chainId: 11155111,
        functionName: "sendToken(uint256)",
        args: [amount],
        gasLimit: 5000000
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
                        <h4 className='balance'>Balance: {balanceData?.formatted}{balanceData?.symbol}</h4>
                        <input
                            type='text'
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className='amount'
                            placeholder='Enter Amount'>
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
