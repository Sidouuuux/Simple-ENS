import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Confetti from 'react-dom-confetti';

import { ethers } from "ethers";
import { useProvider, useAccount, useSigner, useBalance } from 'wagmi'
import CONTRACT_ABI from "../public/Domains.json"

export default function Mint() {
  const provider = useProvider()
  const { address, isConnecting, isDisconnected } = useAccount()
  const { data: signer, isError, isLoading } = useSigner()
  const [domain, setDomain] = useState('');
  const [success, setSuccess] = useState(false);
  const [minted, setMinted] = useState(0);
  const [hash, setHash] = useState('');
  const config = {
    angle: 90,
    spread: 360,
    startVelocity: 40,
    elementCount: "200",
    dragFriction: "0.01",
    duration: 3000,
    stagger: 3,
    width: "10px",
    height: "10px",
    perspective: "500px",
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
  };
  const handleChange = (event) => {
    setDomain(event.target.value);
  };


  const mintDomain = async () => {
    // if (!address) {
    //   toast.error("Connect your wallet !");
    //   return;
    // }
    if (domain.length === 0) {
      toast.error("Domain name too short !");
      return;
    }
    console.log("here");
    const len = domain.length
    const price = len == 3 ? "0.5" : len == 4 ? "0.3" : "0.1"
    try {

      console.log(ethers.utils.formatEther(ethers.utils.parseEther(price)));

      const domainContract = new ethers.Contract(
        "0x1e8ea666eb9a787179e654fbf4b71d4e8a9bb402",
        CONTRACT_ABI.abi,
        provider
      );
      const domainContractWithSigner = domainContract.connect(signer);

      const transaction = await domainContractWithSigner.register(domain, { value: ethers.utils.parseEther(price) });
      setMinted(1)

      const receipt = await transaction.wait()

      receipt && receipt.status == 1 ? toast.success('NFT uccessfully Minted!') && setSuccess(true) : toast.success('Something went wrong :/') && setMinted(0)
      setHash(receipt.transactionHash)
      setMinted(2)
    } catch (err) {
      setMinted(0)
      if (err.stack.includes("insufficient")) {
        provider.getBalance(address).then((balance) => {
          // convert a currency unit from wei to ether
          const balanceInEth = ethers.utils.formatEther(balance)
          console.log(`balance: ${balanceInEth - price} ETH`)
          toast.error(`Insufficent balance, you need ${Math.abs(balanceInEth - price)}MATIC more!`);

        })
      }
    }

  };



  return (
    <div className="flex flex-row justify-center mt-20">
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <div className=" rounded-lg w-5/12">
        <p className='glow text-xl'>
          Mint your NFT
        </p>
        <div className="mt-20 mb-12 flex justify-center text-2xl font-bold ">
          <input maxLength="10"
            type="text"
            className="bg-black border-2 border-white text-white rounded-l-xl block w-3/12 p-2.5 tracking-wider"
            placeholder="Your Domain"
            onChange={handleChange}
          />
          <p className="bg-[#7344b8] border border-white border-r-2 border-t-2 border-b-2 text-gray-900 text-white rounded-r-xl block w-auto p-3 tracking-wider">.sdx</p>
        </div>
        <Confetti active={success} config={config} />
        <div className='flex justify-center items-center'>
          <button
            onClick={mintDomain}
            className='glowing-btn'>
            <span className='glowing-txt'>M<span className='faulty-letter'>I</span>NT</span>
          </button>
        </div>
        <div className='glowfutur justify-center items-center mt-16'>
          {(minted === 2) ? (
            <div>
              <p >
                Your NFT
              </p>
              <a className='text-green-500'
                href={`https://mumbai.polygonscan.com/tx/${hash}`} target="_blank">(transaction link)</a> :
            </div>

          )
            : (minted === 1) ? (
              <p>
                Minting your NFT...
              </p>
            ) : (
              <p >
                Your futur NFT :
              </p>
            )
          }
        </div>
        <div className="my-6 flex justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="270" height="270" fill="none">
            <path fill="url(#B)" d="M0 0h270v270H0z" />
            <defs>
              <filter id="A" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="270" width="270">
                <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity=".225" width="200%" height="200%" />
              </filter>
            </defs>
            <path d="M72.863 42.949c-.668-.387-1.426-.59-2.197-.59s-1.529.204-2.197.59l-10.081 6.032-6.85 3.934-10.081 6.032c-.668.387-1.426.59-2.197.59s-1.529-.204-2.197-.59l-8.013-4.721a4.52 4.52 0 0 1-1.589-1.616c-.384-.665-.594-1.418-.608-2.187v-9.31c-.013-.775.185-1.538.572-2.208a4.25 4.25 0 0 1 1.625-1.595l7.884-4.59c.668-.387 1.426-.59 2.197-.59s1.529.204 2.197.59l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616c.384.665.594 1.418.608 2.187v6.032l6.85-4.065v-6.032c.013-.775-.185-1.538-.572-2.208a4.25 4.25 0 0 0-1.625-1.595L41.456 24.59c-.668-.387-1.426-.59-2.197-.59s-1.529.204-2.197.59l-14.864 8.655a4.25 4.25 0 0 0-1.625 1.595c-.387.67-.585 1.434-.572 2.208v17.441c-.013.775.185 1.538.572 2.208a4.25 4.25 0 0 0 1.625 1.595l14.864 8.655c.668.387 1.426.59 2.197.59s1.529-.204 2.197-.59l10.081-5.901 6.85-4.065 10.081-5.901c.668-.387 1.426-.59 2.197-.59s1.529.204 2.197.59l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616c.384.665.594 1.418.608 2.187v9.311c.013.775-.185 1.538-.572 2.208a4.25 4.25 0 0 1-1.625 1.595l-7.884 4.721c-.668.387-1.426.59-2.197.59s-1.529-.204-2.197-.59l-7.884-4.59a4.52 4.52 0 0 1-1.589-1.616c-.385-.665-.594-1.418-.608-2.187v-6.032l-6.85 4.065v6.032c-.013.775.185 1.538.572 2.208a4.25 4.25 0 0 0 1.625 1.595l14.864 8.655c.668.387 1.426.59 2.197.59s1.529-.204 2.197-.59l14.864-8.655c.657-.394 1.204-.95 1.589-1.616s.594-1.418.609-2.187V55.538c.013-.775-.185-1.538-.572-2.208a4.25 4.25 0 0 0-1.625-1.595l-14.993-8.786z" fill="#fff" />
            <defs>
              <linearGradient id="B" x1="0" y1="0" x2="270" y2="270" gradientUnits="userSpaceOnUse">
                <stop stopColor="#cb5eee" /><stop offset="1" stopColor="#0cd7e4" stopOpacity=".99" />
              </linearGradient>
            </defs>
            <text x="32.5" y="231" fontSize="27" fill="#fff" filter="url(#A)" fontFamily="Plus Jakarta Sans,DejaVu Sans,Noto Color Emoji,Apple Color Emoji,sans-serif" fontWeight="bold">
              {domain}.sdx
            </text>
          </svg>
        </div>
      </div>
    </div>
  )
}
