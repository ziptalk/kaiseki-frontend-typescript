"use client";

import Header from "@/components/Header";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import MCV2_BondArtifact from "@/abis/MCV2_Bond.sol/MCV2_Bond.json";
import MCV2_TokenArtifact from "@/abis/MCV2_Token.sol/MCV2_Token.json";
import reserveTokenABI from "@/abis/ReserveToken/ReserveToken.json";
import contracts from "@/contracts/contracts";
import TokenCard from "@/components/TokenCard";
import Web3 from "web3";
import { useEthersSigner } from "@/hooks/ethers";
import { ethers } from "ethers";
import TradingViewWidget from "@/components/TradingViewWidget";
import TradesCard from "@/components/TokenDetail/TradesCard";

const util = require("util");

export default function Detail() {
  const signer = useEthersSigner();
  const { abi: MCV2_TokenABI } = MCV2_TokenArtifact;
  const { abi: MCV2_BondABI } = MCV2_BondArtifact;
  const wei = (num: number, decimals = 18): bigint => {
    return BigInt(num) * BigInt(10) ** BigInt(decimals);
  };
  const cleanPathname = (path: string) => {
    return path.startsWith("/") ? path.slice(1) : path;
  };
  const pathname = usePathname();

  const account = useAccount();
  const cleanedPathname = cleanPathname(pathname);
  const tokenAddress: any = cleanedPathname;
  const MAX_INT_256: BigInt = BigInt(2) ** BigInt(256) - BigInt(2);

  // const { data: steps } = useReadContract({
  //   abi,
  //   address: contracts.MCV2_Bond,
  //   functionName: "getSteps",
  //   args: [cleanedPathname],
  // });
  // const { data: nextMintPrice } = useReadContract({
  //   abi,
  //   address: contracts.MCV2_Bond,
  //   functionName: "priceForNextMint",
  //   args: [cleanedPathname],
  // });

  // const { data: curMemeTokenValue } = useReadContract({
  //   abi: MCV2_TokenABI,
  //   address: tokenAddress,
  //   functionName: "balanceOf",
  //   args: [account.address],
  // });

  // console.log("memetokenvalue :" + curMemeTokenValue);
  // console.log("steps :" + steps);
  // console.log("nextMintPrice :" + nextMintPrice);

  // MARK: - Initialize web3
  // const web3 = new Web3("https://evm-rpc-arctic-1.sei-apis.com");

  // // The contract ABI (Application Binary Interface), you can get this from the Solidity contract or Etherscan
  // const contractABI = MCV2_TokenABI; //put your ABI here
  // const tokenContractABI = reserveTokenABI; //put your ABI here
  // const memeTokenContractABI = MCV2_TokenABI;

  // // The contract address
  // const contractAddress = contracts.MCV2_Bond;
  // const tokenContractAddress = contracts.ReserveToken;

  // // Create a new contract instance
  // const contract = new web3.eth.Contract(contractABI, contractAddress);
  // const tokenContract = new web3.eth.Contract(
  //   tokenContractABI,
  //   contractAddress,
  // );
  // const memeTokenContract = new web3.eth.Contract(
  //   memeTokenContractABI,
  //   tokenAddress,
  // );

  // MARK: - init ethers.js
  const { ethers } = require("ethers");
  const provider = new ethers.JsonRpcProvider(
    "https://evm-rpc-arctic-1.sei-apis.com",
  );
  const bondContract = new ethers.Contract(
    contracts.MCV2_Bond,
    MCV2_BondABI,
    provider,
  );

  const memeTokenContract = new ethers.Contract(
    tokenAddress,
    MCV2_TokenABI,
    provider,
  );
  // Call the getSteps function
  // MARK: - useState
  const [name, setName] = useState("Name");
  const [symbol, setSymbol] = useState("ticker");
  const [creator, setCreator] = useState("Me");
  const [isBuy, setIsBuy] = useState(true);
  const [curMemeTokenValue, setCurMemeTokenValue] = useState("0");
  const [marketCap, setMarketCap] = useState("");

  useEffect(() => {
    // contract.methods
    //   .getSteps(tokenAddress)
    //   .call()
    //   .then((steps: any) => {
    //     console.log(steps);
    //   })
    //   .catch((error: any) => {
    //     console.error(error);
    //   });

    // contract.methods
    //   .getDetail(tokenAddress)
    //   .call()
    //   .then((detail: any) => {
    //     console.log("name :" + detail.info.name);
    //     console.log("symbol :" + detail.info.symbol);
    //     console.log("creator :" + detail.info.creator);
    //     // console.log("currentSupply :" + detail.info.currentSupply);
    //     setName(detail.info.name);
    //     setSymbol(detail.info.symbol);
    //     setCreator(detail.info.creator);
    //     // setMarketCap(detail.info.marketCap);
    //   })
    //   .catch((error: any) => {
    //     console.error(error);
    //   });
    const fetchTokenDetail = async () => {
      try {
        const detail = await bondContract.getDetail(tokenAddress);

        // Log and set the state with the returned details
        console.log("name :" + detail.info.name);
        console.log("symbol :" + detail.info.symbol);
        console.log("creator :" + detail.info.creator);
        // console.log("currentSupply :" + detail.info.currentSupply);
        setName(detail.info.name);
        setSymbol(detail.info.symbol);
        setCreator(detail.info.creator);
        // setMarketCap(detail.info.marketCap);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTokenDetail();
    getMemeTokenValue();
  }, []);

  useEffect(() => {
    getMemeTokenValue();
  }, [account.address]);

  const getMemeTokenValue = async () => {
    try {
      if (!account.address) {
        throw new Error("Account is not defined");
      }
      const detail = await memeTokenContract.balanceOf(account.address);
      console.log(detail);
      const formattedDetail = ethers.utils.formatUnits(detail, 18);
      setCurMemeTokenValue(formattedDetail);
    } catch (error) {
      console.log(error);
    }
  };

  const {
    writeContract,
    error,
    isPending,
    data: mintData,
    isSuccess,
    writeContractAsync,
    status,
  } = useWriteContract();

  // MARK: - Buy

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const inputValue = formData.get("inputValue") as string;

    console.log("start-app");

    try {
      const tx = await writeContractAsync({
        address: contracts.ReserveToken,
        abi: reserveTokenABI,
        functionName: "approve",
        args: [contracts.MCV2_Bond, BigInt(wei(Number(inputValue)))],
      });

      console.log(tx);

      // Wait for the approve transaction to be mined

      console.log("start-mint");
      const mintTx = await writeContractAsync({
        address: contracts.MCV2_Bond,
        abi: MCV2_BondABI,
        functionName: "mint",
        args: [
          tokenAddress,
          BigInt(wei(Number(inputValue))),
          MAX_INT_256,
          account.address,
        ],
      });

      console.log(mintTx);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  // MARK: - Sell

  async function submitSell(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const inputValue = formData.get("inputValue") as string;

    // await memeTokenContract.methods
    //   .approve(contracts.MCV2_Bond, Number(inputValue))
    //   .send({ from: account.address })
    //   .then((reciept) => {
    //     console.log(reciept);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });

    // await contract.methods
    //   .burn(tokenAddress, Number(inputValue), 0, account.address)
    //   .send({ from: account.address })
    //   .then((reciept) => {
    //     console.log(reciept);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });

    console.log("start-app");
    const tx = await writeContractAsync({
      address: tokenAddress,
      abi: MCV2_TokenABI,
      functionName: "approve",
      args: [contracts.MCV2_Bond, BigInt(wei(Number(inputValue)))],
    });

    console.log("start-mint");
    await writeContractAsync({
      address: contracts.MCV2_Bond,
      abi: MCV2_BondABI,
      functionName: "burn",
      args: [tokenAddress, BigInt(wei(Number(inputValue))), 0, account.address],
    });
  }

  useEffect(() => {
    console.log(error);
  }, [error]);

  return (
    <>
      <main className="flex w-screen bg-gradient-to-br from-[#1F1F1F] to-[#220A09]">
        <div className="mx-auto flex h-full w-full justify-between px-[5vw] pt-[60px]">
          <div className="w-[60vw] border">
            <div className="flex h-[245px] justify-between border px-[20px] py-[30px]">
              <div className="w-[40%]">
                <TokenCard
                  name={name}
                  ticker={symbol}
                  cap="0.00"
                  createdBy={creator.substring(0, 5)}
                  desc="desc"
                  tokenAddress=""
                />
              </div>

              <div className="flex h-full w-[20%] flex-col items-center justify-center text-lg">
                <h1>[twitter logo]</h1>
                <h1>[twitter logo]</h1>
                <h1>[twitter logo]</h1>
              </div>
              <div className="flex h-full w-[40%] flex-col justify-between border ">
                <div className="flex">
                  <h1 className="text-lg font-bold text-[#ADADAD]">
                    bonding curve progress:&nbsp;
                  </h1>
                  <h1 className="text-[#FAFF00]">00%</h1>
                </div>
                <div className=" h-[12px] w-full rounded-full bg-[#343434] text-[13px]"></div>
                <h1 className="h-[75px] text-[#6A6A6A]">
                  Pizza ipsum dolor meat lovers buffalo. Garlic Hawaiian sautéed
                  bell bell roll Bianca wing steak meat. Green spinach deep thin
                </h1>
              </div>
            </div>
            <div className="mt-[20px] flex h-[420px]  gap-[20px] border ">
              <TradingViewWidget />
            </div>
            <div className="mt-[30px]  gap-[20px] rounded-[10px] border bg-[#1A1A1A] p-[30px]">
              <div className="flex w-full justify-between border-b border-[#6A6A6A] px-[10px] pb-[15px] text-[#6A6A6A]">
                <h1 className="w-1/6">account</h1>
                <h1 className="w-1/6">buy / sell</h1>
                <h1 className="w-1/6">SEI</h1>
                <h1 className="w-1/6">{symbol}</h1>
                <h1 className="w-1/6">date</h1>
                <h1 className="flex w-1/6 flex-row-reverse">transaction</h1>
              </div>
              <TradesCard
                isBuy={true}
                seiAmount="0.0143"
                memeTokenAmount="124.5k"
                date="May 14 5:34:37 pm"
                tx="d3vb4i"
              />
              <TradesCard
                isBuy={false}
                seiAmount="0.0143"
                memeTokenAmount="124.5k"
                date="May 14 5:34:37 pm"
                tx="d3vb4i"
              />
              <div className="mt-[15px] flex h-[60px] items-center justify-between rounded-[10px] bg-[#242424] px-[10px] text-[#6A6A6A]">
                <div className="flex w-1/6 items-center gap-[5px]">
                  <div className="h-[18px] w-[18px] rounded-full bg-gray-100"></div>
                  <h1>acc</h1>
                </div>
                <h1 className="w-1/6">buy</h1>
                <h1 className="w-1/6">sei amount</h1>
                <h1 className="w-1/6">mc amount</h1>
                <h1 className="w-1/6">May 14 5:34:37 pm</h1>
                <h1 className=" flex w-1/6 flex-row-reverse">d3vb4i</h1>
              </div>
            </div>
          </div>
          <div>
            <div className="h-[360px] w-[420px]  rounded-[15px] bg-[#A60600] p-[30px]">
              <div className="flex gap-[10px] rounded-[15px] bg-black p-[10px]">
                <button
                  className="h-[44px] w-full rounded-2xl bg-white"
                  onClick={() => setIsBuy(true)}
                >
                  Buy
                </button>
                <button
                  className="h-[44px] w-full rounded-2xl bg-white"
                  onClick={() => setIsBuy(false)}
                >
                  Sell
                </button>
              </div>
              <form
                onSubmit={isBuy ? submit : submitSell}
                className="flex flex-col"
              >
                <div className="flex justify-between">
                  <div></div>
                  <div className="mt-[15px] flex h-[30px] w-[128px] items-center justify-center rounded-lg bg-black text-sm text-[#A7A7A7]">
                    Set max slippage
                  </div>
                </div>

                <input
                  className="my-[8px] h-[55px] rounded-[5px] bg-black px-[20px] text-[#5C5C5C]"
                  type="number"
                  placeholder="0.00"
                  name="inputValue"
                ></input>
                <h1 className="text-[#B8B8B8]">
                  {curMemeTokenValue}&nbsp;
                  {name}
                </h1>
                <div className="my-[15px] flex justify-between">
                  <h1 className="text-sm text-white">{status}</h1>
                  <button>t</button>
                </div>

                <button
                  type="submit"
                  className="h-[50px] w-full rounded-2xl bg-white"
                >
                  place trade
                </button>
              </form>
            </div>
            <div className="mt-[70px] h-[560px] w-[420px] rounded-[10px] border bg-[#1A1A1A] p-[30px]">
              <h1 className="font-bold text-[#ADADAD]">Holder distribution</h1>
              <div className="mt-[20px] gap-[8px] text-[#6A6A6A]">
                <div className=" flex justify-between font-bold">
                  <h1>1. C87gCy 💳 (bonding curve)</h1>
                  <h1>98.48%</h1>
                </div>
                <div className=" flex justify-between">
                  <h1>2. H41bQv 🛠️ (dev)</h1>
                  <h1>01.52%</h1>
                </div>
                <div className=" flex justify-between">
                  <h1>3. H41bQv</h1>
                  <h1>01.52%</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
