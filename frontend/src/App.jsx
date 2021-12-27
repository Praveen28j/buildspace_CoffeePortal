import React, { useEffect, useState } from "react";
import './App.css';
import { ethers } from "ethers";
import abi from './utils/CoffeePortal.json';

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
    const contractAddress = "Contract_address";
  const contractABI = abi.abi;
  const [allWaves, setAllCoffee] = React.useState([]);
  const[message, setMessage] = React.useState("");
  const [currCount, setCurrCount] = React.useState("");

const initCount = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner()
  const coffeePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

  let count = await coffeePortalContract.getTotalCoffee()
  console.log("Retrieved total coffees", count.toNumber())
  setCurrCount(count.toNumber())
}

  const getAllCoffee = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const coffeePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        const coffees = await coffeePortalContract.getAllCoffees();
        

        let coffeeCleaned = [];
        coffees.forEach(coffee => {
          coffeeCleaned.push({
            address: coffee.sender,
            timestamp: new Date(coffee.timestamp * 1000),
            message: coffee.message
          });
        });

    
        setAllCoffee(coffeeCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

  React.useEffect(() => {
  let coffeePortalContract;

  const onNewCoffee = (from, timestamp, message) => {
    console.log('NewCoffee', from, timestamp, message);
    setAllCoffee(prevState => [
      ...prevState,
      {
        address: from,
        timestamp: new Date(timestamp * 1000),
        message: message,
      },
    ]);
    
  };

  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    coffeePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
    coffeePortalContract.on('NewCoffee', onNewCoffee);
  }

return () => {
    if (coffeePortalContract) {
      coffeePortalContract.off('NewCoffee', onNewCoffee);
    }
  };
}, []);


  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
        getAllCoffee();
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
      
    } catch (error) {
      console.log(error)
    }
  }
const coffee = async () => {
      try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const coffeePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await coffeePortalContract.getTotalCoffee();
        console.log("Retrieved total coffee count...", count.toNumber());
        /*
        * Execute the actual wave from your smart contract
        */
        const waveTxn = await coffeePortalContract.coffee(message, { gasLimit: 300000 });
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await coffeePortalContract.getTotalCoffee();
        console.log("Retrieved total coffee count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
}
  React.useEffect(() => {
    checkIfWalletIsConnected();
      initCount();
  }, [])
  
  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        👋 Hey there! I have received {currCount} coffees
        </div>

        <div className="bio">
          Click below to get me coffee and drop a message!
        </div>

       
        {/*
        * If there is no currentAccount render this button
        */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      <textarea placeholder="Send a message with coffee" value={message} onChange={(event) => setMessage(event.target.value)}/>
       <button className="waveButton" onClick={coffee}>
          Coffee
        </button>
        

       {allWaves.map((coffee, index) => {
          return (
            <div key={index} className= "msgCon" >
              <div><b>Address: </b>{coffee.address}</div>
              <div><b>Time: </b>{coffee.timestamp.toString()}</div>
              <div><b>Message:</b> {coffee.message}</div>
            </div>)
        })}
      </div>
    </div>
  );
}

export default App
