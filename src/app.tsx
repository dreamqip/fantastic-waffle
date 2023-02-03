import {useEffect, useState} from 'preact/hooks'
import preactLogo from './assets/preact.svg'
import {ethers} from 'ethers';
import './app.css'

const provider = new ethers.providers.Web3Provider(window.ethereum);

await provider.send('eth_requestAccounts', []);

const signer = provider.getSigner();

const fromAddress = '0xFEb99C9E922458005d5B3735A08Ff8b29a875e51';
const recipientAddress = '0xFEb99C9E922458005d5B3735A08Ff8b29a875e51';

export function App() {
    const [wallet, setWallet] = useState<ethers.Wallet>();
    const [walletSigner, setWalletSigner] = useState<ethers.Signer>();
    const [loading, setLoading] = useState(false);
    const [balance, setBalance] = useState(0);

    const createRandomPrivateKey = () => {
        return ethers.utils.hexlify(ethers.utils.randomBytes(32));
    }

    const createWallet = async () => {
        const createWallet = new ethers.Wallet(createRandomPrivateKey(), provider);
        const signer = createWallet.connect(provider);

        setWallet(createWallet);
        setWalletSigner(signer);
    }

    const sendTokensForWallet = async () => {
        const tx = {
            from: fromAddress,
            to: wallet?.address,
            value: ethers.utils.parseEther('0.01'),
        }
        setLoading(true);
        const transaction = await signer.sendTransaction(tx);
        await transaction.wait()
        await getBalance();
        setLoading(false);
    }

    const sendTokensToRecipient = async () => {
        const tx = {
            from: wallet?.address,
            to: recipientAddress,
            value: ethers.utils.parseEther('0.001'),
        }
        setLoading(true);
        const transaction = await walletSigner?.sendTransaction(tx);
        await transaction?.wait()
        await getBalance();
        setLoading(false);
    }

    // const sendTokensBackToFromAddress = async () => {
    //     const tx = {
    //         to: fromAddress,
    //         value: ethers.utils.parseEther('0.015')
    //     }
    //     setLoading(true);
    //     await wallet?.sendTransaction(tx);
    //     setLoading(false);
    // }

    const getBalance = async () => {
        const balance = await wallet?.getBalance();
        const formatEthers = ethers.utils.formatEther(balance || 0);
        setBalance(Number(formatEthers));
    }

    return (
        <>
            <div>
                <a href="https://vitejs.dev" target="_blank">
                    <img src="/vite.svg" class="logo" alt="Vite logo"/>
                </a>
                <a href="https://preactjs.com" target="_blank">
                    <img src={preactLogo} class="logo preact" alt="Preact logo"/>
                </a>
            </div>
            <h1>Vite + Preact</h1>
            <div class="card">
                <button onClick={createWallet} disabled={loading}>
                    {loading ? 'Loading...' : 'Create Wallet'}
                </button>
                <button onClick={sendTokensForWallet} disabled={loading}>
                    {loading ? 'Loading...' : 'Send Tokens'}
                </button>
                <button onClick={sendTokensToRecipient} disabled={loading}>
                    {loading ? 'Loading...' : 'Send Tokens To Recipient'}
                </button>
                <p>
                    Wallet Address: {wallet?.address || 'No wallet created yet'}
                </p>
                <p>
                    Balance: {wallet ? balance : 'No wallet created yet'}
                </p>
            </div>
            <p class="read-the-docs">
                Click on the Vite and Preact logos to learn more
            </p>
        </>
    )
}
