"use client";

import Header from "@/components/Header";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { abi } from "@/abis/MCV2_Bond.sol/MCV2_Bond.json";
import MCV2_TokenArtifact from "@/abis/MCV2_Token.sol/MCV2_Token.json";
import reserveTokenABI from "@/abis/ReserveToken/ReserveToken.json";
import contracts from "@/contracts/contracts";
import TokenCard from "@/components/TokenCard";
import Web3 from "web3";

const util = require("util");

export default function Detail() {
  const { abi: MCV2_TokenABI } = MCV2_TokenArtifact;
  const wei = (num: number, decimals = 18): bigint => {
    return BigInt(num) * BigInt(10) ** BigInt(decimals);
  };
  const pathname = usePathname();
  const cleanPathname = (path: string) => {
    return path.startsWith("/") ? path.slice(1) : path;
  };

  const cleanedPathname = cleanPathname(pathname);
  const tokenAddress: any = cleanedPathname;

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
  // console.log("steps :" + steps);
  // console.log("nextMintPrice :" + nextMintPrice);

  // Initialize web3
  const web3 = new Web3("https://evm-rpc-arctic-1.sei-apis.com");

  // The contract ABI (Application Binary Interface), you can get this from the Solidity contract or Etherscan
  const contractABI = abi; //put your ABI here
  const tokenContractABI = reserveTokenABI; //put your ABI here
  const memeTokenContractABI = MCV2_TokenABI;

  // The contract address
  const contractAddress = contracts.MCV2_Bond;
  const tokenContractAddress = contracts.ReserveToken;

  // Create a new contract instance
  const contract = new web3.eth.Contract(contractABI, contractAddress);
  const tokenContract = new web3.eth.Contract(
    tokenContractABI,
    contractAddress,
  );
  const memeTokenContract = new web3.eth.Contract(
    memeTokenContractABI,
    tokenAddress,
  );

  // Call the getSteps function

  const account = useAccount();

  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [creator, setCreator] = useState("");
  const [isBuy, setIsBuy] = useState(true);
  const [marketCap, setMarketCap] = useState("");

  useEffect(() => {
    contract.methods
      .getSteps(tokenAddress)
      .call()
      .then((steps: any) => {
        console.log(steps);
      })
      .catch((error: any) => {
        console.error(error);
      });

    contract.methods
      .getDetail(tokenAddress)
      .call()
      .then((detail: any) => {
        console.log("name :" + detail.info.name);
        console.log("symbol :" + detail.info.symbol);
        console.log("creator :" + detail.info.creator);
        // console.log("currentSupply :" + detail.info.currentSupply);
        setName(detail.info.name);
        setSymbol(detail.info.symbol);
        setCreator(detail.info.creator);
        // setMarketCap(detail.info.marketCap);
      })
      .catch((error: any) => {
        console.error(error);
      });
  }, []);

  const {
    writeContract,
    error,
    isPending,
    data: mintData,
    isSuccess,
    writeContractAsync,
    status,
  } = useWriteContract();

  const MAX_INT_256: BigInt = BigInt(2) ** BigInt(256) - BigInt(2);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const inputValue = formData.get("inputValue") as string;

    // await tokenContract.methods
    //   .approve(tokenContractAddress, Number(inputValue))
    //   .send({ from: account.address })
    //   .then((reciept) => {
    //     console.log(reciept);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });

    // await contract.methods
    //   .mint(tokenAddress, Number(inputValue), MAX_INT_256, account.address)
    //   .send({ from: account.address })
    //   .then((reciept) => {
    //     console.log(reciept);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });

    console.log("start-app");
    const tx = await writeContractAsync({
      address: contracts.ReserveToken,
      abi: reserveTokenABI,
      functionName: "approve",
      args: [contracts.MCV2_Bond, BigInt(wei(Number(inputValue)))],
    });

    console.log(tx);

    console.log("start-mint");
    await writeContractAsync({
      address: contracts.MCV2_Bond,
      abi,
      functionName: "mint",
      args: [
        tokenAddress,
        BigInt(wei(Number(inputValue))),
        MAX_INT_256,
        account.address,
      ],
    });
  }

  //////////////////////////////////////////////////////////////////////////////

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
      abi,
      functionName: "burn",
      args: [tokenAddress, BigInt(wei(Number(inputValue))), 0, account.address],
    });
  }

  useEffect(() => {
    console.log(error);
  }, [error]);

  return (
    <>
      <Header />

      <main className="flex h-screen w-screen bg-gradient-to-br from-[#1F1F1F] to-[#220A09]">
        <div className="h-full w-full bg-green-100">
          {cleanedPathname}
          <TokenCard
            name={name}
            ticker={symbol}
            cap="0.00"
            createdBy={creator}
            desc="aa"
          />
          <div className="h-[430px] w-[430px] bg-red-100">
            <div className="flex">
              <button onClick={() => setIsBuy(!isBuy)}>
                {isBuy ? "Buy" : "Sell"}
              </button>
            </div>
            <form onSubmit={isBuy ? submit : submitSell} className="flex-col">
              <input type="number" name="inputValue"></input>
              <button type="submit">place trade</button>
            </form>
            <div>{status}</div>
          </div>
        </div>

        <div></div>
      </main>
    </>
  );
}
