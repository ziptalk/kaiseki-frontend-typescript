"use client";

import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { useAccount, useReadContract, useWatchContractEvent } from "wagmi";
import { abi } from "@/abis/MCV2_Bond.sol/MCV2_Bond.json";
import contracts from "@/contracts/contracts";
import { type UseReadContractReturnType } from "wagmi";
import Link from "next/link";
import TokenCard from "@/components/TokenCard";
import Image from "next/image";

export default function Home() {
  const [curCreateTic, setCurCreateTic] = useState("MEME");
  const [curCreateUser, setCurCreateUser] = useState("0x7A2");
  const [curCreateTime, setCurCreateTime] = useState("Date");
  const [curCreateName, setCurCreateName] = useState("Name");
  const [curCreateAddress, setCurCreateAddress] = useState("");
  const [createDatas, setCreateDatas] = useState<any[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  // Initialize ethers with a provider
  const { ethers } = require("ethers");

  // Load the ABI from the specified file
  const contractABI = abi;

  // Contract address
  const contractAddress = contracts.MCV2_Bond;

  // Initialize ethers with a provider
  const provider = new ethers.JsonRpcProvider(
    "https://evm-rpc-arctic-1.sei-apis.com",
  );

  // Create a contract instance
  const contract = new ethers.Contract(contractAddress, contractABI, provider);

  async function fetchCreateHomeEventsInBatches(
    fromBlock: any,
    batchSize: any,
  ) {
    let currentBlock = await provider.getBlockNumber();
    let toBlock = fromBlock + batchSize - 1; // Adjust to ensure the batch size is as specified

    const isFetchingHomeCreate = localStorage.getItem("isFetchingHomeCreate");
    if (isFetchingHomeCreate === "true") {
      console.log(
        "FetchingHomeCreate is already in progress. Aborting this instance.",
      );
      localStorage.setItem("isFetchingHomeCreate", "false");
      return;
    }

    // Set the fetchingHomeCreate flag to true
    localStorage.setItem("isFetchingHomeCreate", "true");

    while (fromBlock <= currentBlock) {
      console.log(
        `FetchingHomeCreate events from block ${fromBlock} to ${toBlock}`,
      );

      // Adjust toBlock for the last batch if it exceeds currentBlock
      if (toBlock > currentBlock) {
        toBlock = currentBlock;
      }

      const events = await contract.queryFilter(
        contract.filters.TokenCreated(),
        fromBlock,
        toBlock,
      );
      const newDatas = await Promise.all(
        events
          .slice(0)
          .reverse()
          .map(async (event: any) => {
            const block = await provider.getBlock(event.blockNumber);
            const timestamp = block.timestamp;
            const date = new Date(timestamp * 1000);

            // Format the date as DD/MM/YY
            const formattedDate = `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}/${String(date.getFullYear()).slice(-2)}`;

            // Log the event details along with the block timestamp
            console.log(
              `Token Created: ${event.args.name} (${event.args.symbol}), Token Address: ${event.args.token}, Reserve Token: ${event.args.reserveToken} Block Timestamp: ${date}`,
            );
            setCurCreateTic(event.args.symbol.substring(0, 5));
            setCurCreateUser(event.args.token.substring(0, 5)); // Fake value!
            setCurCreateTime(formattedDate);

            return {
              name: event.args.name,
              tic: event.args.symbol.substring(0, 5),
              user: event.args.token.substring(0, 5), // Fake value!
              time: formattedDate,
              addr: event.args.token,
            };
          }),
      );

      setCreateDatas((prevDatas) => [...newDatas, ...prevDatas]);

      // const newDatas = events.map((event: any) => ({
      //   tic: event.args.symbol.substring(0, 5),
      //   user: event.args.token.substring(0, 5),
      // }));

      // setCreateDatas((prevDatas) => [...newDatas, ...prevDatas]);

      // events.forEach((event: any) => {
      //   console.log(
      //     `Token Created: ${event.args.name} (${event.args.symbol}), Token Address: ${event.args.token}, Reserve Token: ${event.args.reserveToken}`,
      //   );
      //   setCurCreateTic(event.args.symbol.substring(0, 5));
      //   setCurCreateUser(event.args.token.substring(0, 5)); // Fake value!
      // });

      // Prepare for the next batch
      fromBlock = toBlock + 1;
      toBlock = fromBlock + batchSize - 1;

      // Small delay to prevent rate limiting (optional, adjust as necessary)
      // await new Promise((resolve) => setTimeout(resolve, 1));
    }
    localStorage.setItem("isFetchingHomeCreate", "false");
  }

  useEffect(() => {
    fetchCreateHomeEventsInBatches(19966627, 5000);
  }, []);
  return (
    <>
      <main className="flex w-screen bg-black">
        <div className="mx-auto h-full w-[70vw]  pt-10 ">
          <div className="mx-auto flex h-[465px] w-[55vw] max-w-[970px] items-center justify-evenly rounded-2xl border-2 border-[#FAFF00] bg-gradient-to-b from-red-600 to-red-800 py-[30px] shadow-[0_0px_20px_rgba(0,0,0,0.5)]  shadow-[#FAFF00]">
            <div className="flex h-full flex-col justify-between">
              <div className="flex h-full w-[500px] flex-col items-center gap-[30px] rounded-3xl border-2 border-white bg-black py-[30px] shadow-[0_0px_20px_rgba(0,0,0,0.5)] shadow-white">
                <div className="flex h-[50px] w-[340px] items-center justify-center border bg-gradient-to-b from-zinc-900 to-rose-950">
                  <h1 className="text-borderline  text-3xl font-black text-white ">
                    To the moon
                  </h1>
                </div>
                <div className="w-[390px]">
                  <TokenCard
                    name="R5"
                    ticker="R5"
                    cap="1:24"
                    desc=""
                    createdBy="Me"
                    tokenAddress="0xfb4a803Eb8Ca7464AC5ad74ae4D08E9cF676d29c"
                  />
                </div>
                <div className="flex h-[140px] w-[390px] gap-[5px] rounded-lg border-4 border-[#A58C07] bg-black bg-gradient-to-b from-neutral-600 via-neutral-800 to-neutral-600 p-[10px]">
                  <div className="h-full w-[120px] rounded-xl bg-white"></div>
                  <div className="h-full w-[120px] rounded-xl bg-white"></div>
                  <div className="h-full w-[120px] rounded-xl bg-white"></div>
                </div>
              </div>
            </div>
            <Link href="/create" className="z-10">
              <div className="flex h-[300px] w-[200px] flex-col items-center justify-center gap-[30px] rounded-[20px] border-4 border-[#E5180E] shadow-inner ">
                <h1 className="text-xl font-black text-white">
                  Create new coin
                </h1>
                <div
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="h-[140px] w-[80px] rounded-2xl "
                >
                  <Image
                    src={isHovered ? "/images/Yellow.svg" : "/images/Red.svg"}
                    alt="Create"
                    width={500}
                    height={500}
                    className="h-full w-full"
                  />
                </div>
              </div>
            </Link>
          </div>

          <div className="mt-10 flex h-[50px] w-full justify-between  px-10">
            <div className="h-full">
              <button className="mr-[20px] h-[50px] w-[160px] rounded-[10px] bg-[#353535]">
                sort: newest
              </button>
              <button className="h-[50px] w-[160px] rounded-[10px] bg-[#353535]">
                sort: newest
              </button>
            </div>
            <form className="">
              <input
                className="mr-[30px] h-[50px] w-[422px] rounded-[10px] border border-[#FF00C6] bg-black px-[20px] text-white"
                placeholder="search for token"
              ></input>
              <button className="h-[50px] w-[150px] rounded-[10px] bg-[#FF00C6]">
                search
              </button>
            </form>
          </div>

          <div className="mt-10 grid h-[800px] w-full min-w-[1100px] grid-cols-3 grid-rows-4 gap-[60px] p-8">
            {createDatas.map((card: any, index: any) => (
              <TokenCard
                key={index}
                name={card.name}
                ticker={card.tic}
                tokenAddress={card.addr}
                cap="1:24"
                createdBy="Me"
                desc="desc"
              />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
