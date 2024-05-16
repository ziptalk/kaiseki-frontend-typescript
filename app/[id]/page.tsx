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
        <div className="mx-auto flex h-full justify-between gap-[80px] pt-[60px]">
          <div>
            <div className="flex h-[245px] gap-[20px] border px-[20px] py-[30px]">
              <TokenCard
                name={name}
                ticker={symbol}
                cap="0.00"
                createdBy={creator.substring(0, 5)}
                desc="aa"
                tokenAddress=""
              />
              <div className="flex h-full flex-col items-center justify-center text-lg">
                <h1>[twitter logo]</h1>
                <h1>[twitter logo]</h1>
                <h1>[twitter logo]</h1>
              </div>
              <div className="flex h-full w-[400px] flex-col justify-between border ">
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
            <div className="mt-[20px] flex h-[420px]  gap-[20px] border px-[20px] py-[30px]"></div>
            <div className="mt-[30px] flex h-[240px]  gap-[20px] border px-[20px] py-[30px]"></div>
          </div>
          <div>
            <div className="h-[360px] w-[420px] rounded-2xl bg-red-100 p-[30px]">
              <div className="flex gap-[10px] p-[10px]">
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
                  <div className=" flex h-[30px] w-[128px] items-center justify-center rounded-lg bg-black text-sm text-white">
                    Set max slippage
                  </div>
                </div>

                <input
                  className="h-[55px] bg-black px-[20px] text-[#5C5C5C]"
                  type="number"
                  placeholder="0.00"
                  name="inputValue"
                ></input>
                <h1>{curMemeTokenValue} MEME</h1>
                <div className="flex justify-between">
                  <h1 className="text-sm">{status}</h1>
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
            <div className="mt-[70px] h-[560px] w-[420px] border"></div>
          </div>
        </div>
      </main>
    </>
  );
}
