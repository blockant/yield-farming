import { useEffect, useState } from 'react';
import './App.css';
// import contract from './contracts/NFTCollectible.json';
import { ethers } from 'ethers';
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";

const contractAddress = "0x9aDD576F857b105C6015c0B2f35CD91FdcB3e666";
const abi = [{"inputs":[{"internalType":"address","name":"_token","type":"address"},{"internalType":"uint256","name":"_rewardPerBlock","type":"uint256"},{"internalType":"address","name":"_factoryContract","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"_lpToken","type":"address"},{"internalType":"uint256","name":"_lpRewardProportion","type":"uint256"}],"name":"addLPToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balances","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_lpToken","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"depositLP","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"factoryContract","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_lpToken","type":"address"}],"name":"getLPBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getReward","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"isLPToken","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastUpdateBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"lpBalances","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"lpRewardProportions","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"lpTokenList","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"rewardPerBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"token","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalRewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_lpToken","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"withdrawLP","outputs":[],"stateMutability":"nonpayable","type":"function"}];
const ERC20abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"initSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}];

function App() {

  const [currentAccount, setCurrentAccount] = useState(null);

  const [tokenAddress, setTokenAddress] = useState();
  const [rewardProportion, setRewardProportion] = useState();

  const [depositTokenAddress, setDepositTokenAddress] = useState();
  const [depositAmount, setDepositAmount] = useState();

  const [withdrawalTokenAddress, setWithdrawalTokenAddress] = useState();
  const [withdrawalAmount, setWithdrawalAmount] = useState();

  const [walletAddress, setWallet] = useState("");

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have Metamask installed!");
      return;
    } else {
      console.log("Wallet exists! We're ready to go!")
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account: ", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  }

  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Please install Metamask!");
    }

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log("Found an account! Address: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err)
    }
  }

  const AddLPTokenHandler = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const FarmContract = new ethers.Contract(contractAddress, abi, signer);

        console.log("Initialize payment");
        let addLPTokenTxn = await FarmContract.addLPToken(tokenAddress, rewardProportion);

        console.log("Mining... please wait");
        await addLPTokenTxn.wait();

        console.log(`Mined, see transaction: https://mumbai.polygonscan.com/tx/${addLPTokenTxn.hash}`);

      } else {
        console.log("Ethereum object does not exist");
      }

    } catch (err) {
      console.log(err);
    }
  }

  const DepositLPTokenHandler = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const FarmContract = new ethers.Contract(contractAddress, abi, signer);

        const ERC20Contract = new ethers.Contract(depositTokenAddress, ERC20abi, signer);

        console.log("Farm Contract Address: ", FarmContract.address);

        console.log("Initialize Approval");
        let erc20AllowanceTxn = await ERC20Contract.approve(FarmContract.address, depositAmount);

        console.log("Mining... please wait");
        await erc20AllowanceTxn.wait();

        console.log(`Mined, see transaction: https://mumbai.polygonscan.com/tx/${erc20AllowanceTxn.hash}`);

        console.log("Initialize payment");
        let depositLPTokenTxn = await FarmContract.depositLP(depositTokenAddress, depositAmount);

        console.log("Mining... please wait");
        await depositLPTokenTxn.wait();

        console.log(`Mined, see transaction: https://mumbai.polygonscan.com/tx/${depositLPTokenTxn.hash}`);

      } else {
        console.log("Ethereum object does not exist");
      }

    } catch (err) {
      console.log(err);
    }
  }

  const GetRewardHandler = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const FarmContract = new ethers.Contract(contractAddress, abi, signer);

        console.log("Initialize payment");
        let getRewardTxn = await FarmContract.getReward();

        console.log("Mining... please wait");
        await getRewardTxn.wait();

        console.log(`Mined, see transaction: https://mumbai.polygonscan.com/tx/${getRewardTxn.hash}`);

      } else {
        console.log("Ethereum object does not exist");
      }

    } catch (err) {
      console.log(err);
    }
  }

  const WithdrawLPTokenHandler = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const FarmContract = new ethers.Contract(contractAddress, abi, signer);

        console.log("Initialize payment");
        let withdrawLPTokenTxn = await FarmContract.withdrawLP(withdrawalTokenAddress, withdrawalAmount);

        console.log("Mining... please wait");
        await withdrawLPTokenTxn.wait();

        console.log(`Mined, see transaction: https://mumbai.polygonscan.com/tx/${withdrawLPTokenTxn.hash}`);

      } else {
        console.log("Ethereum object does not exist");
      }

    } catch (err) {
      console.log(err);
    }
  }


  const connectWalletButton = () => {
    return (
      <button onClick={connectWalletHandler} className='cta-button connect-wallet-button'>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>
    )
  }

  const InteractionPage = () => {
    return (
      <div>
        <div>
          <Card color="transparent" shadow={false}>
        <Typography variant="h4" color="blue-gray">
          Add LP Tokens
        </Typography>
        <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
          <div className="mb-4 flex flex-col gap-6">
            <Input size="lg" placeholder='LP Token Address' value={tokenAddress} onChange={e => setTokenAddress(e.target.value)} /> <br />
            <Input size="lg" placeholder='LP Reward Proportion' value={rewardProportion} onChange={e => setRewardProportion(e.target.value)} /> <br />
          </div>
        </form>
      </Card>

          <button onClick={AddLPTokenHandler} className='cta-button mint-nft-button'>
            Add 
          </button>
        </div>

        <div>
        <Card color="transparent" shadow={false}>
        <Typography variant="h4" color="blue-gray">
        Deposit LP Tokens
        </Typography>
        <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
        <div className="mb-4 flex flex-col gap-6">
          <Input size="lg" placeholder='Deposit Token Address' value={depositTokenAddress} onChange={e => setDepositTokenAddress(e.target.value)} /> <br />
          <Input size="lg" placeholder='Deposit Amount' value={depositAmount} onChange={e => setDepositAmount(e.target.value)} /> <br />
        </div>
        </form>
        </Card>

        <button onClick={DepositLPTokenHandler} className='cta-button mint-nft-button'>
          Deposit 
        </button>
        </div>

        <div>
        <Card color="transparent" shadow={false}>
        <Typography variant="h4" color="blue-gray">
        Get Reward
        </Typography>
        </Card>

        <button onClick={GetRewardHandler} className='cta-button mint-nft-button'>
          Claim 
        </button>
        </div>


        <div>
        <Card color="transparent" shadow={false}>
        <Typography variant="h4" color="blue-gray">
        Withdraw LP Tokens
        </Typography>
        <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
        <div className="mb-4 flex flex-col gap-6">
          <Input size="lg" placeholder='Withdraw Token Address' value={withdrawalTokenAddress} onChange={e => setWithdrawalTokenAddress(e.target.value)} /> <br />
          <Input size="lg" placeholder='Withdraw Amount' value={withdrawalAmount} onChange={e => setWithdrawalAmount(e.target.value)} /> <br />
        </div>
        </form>
        </Card>

        <button onClick={WithdrawLPTokenHandler} className='cta-button mint-nft-button'>
          Withdraw 
        </button>
        </div>

      </div>
      

    )
  }

  useEffect(() => {
    checkWalletIsConnected();
  }, [])

  return (
    <div className='main-app'>
      <h1>PundiX: Yield Farming </h1> <br />
       <p>{currentAccount ? "Connected account :" + currentAccount : ""}</p>
      <div>
        {currentAccount ? InteractionPage() : connectWalletButton()}
      </div>
    </div>
  )
}

export default App;