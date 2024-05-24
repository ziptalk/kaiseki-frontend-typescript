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
import axios from "axios";
import { digital } from "@/fonts/font";

export default function Home() {
  const [curCreateTic, setCurCreateTic] = useState("MEME");
  const [curCreateUser, setCurCreateUser] = useState("0x7A2");
  const [curCreateTime, setCurCreateTime] = useState("Date");
  const [curCreateName, setCurCreateName] = useState("Name");
  const [curCreateAddress, setCurCreateAddress] = useState("");
  const [createDatas, setCreateDatas] = useState<any[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const ether = (weiValue: bigint, decimals = 18): number => {
    const factor = BigInt(10) ** BigInt(decimals);
    const etherValue = Number(weiValue) / Number(factor);
    return etherValue;
  };

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
      // console.log(
      //   `FetchingHomeCreate events from block ${fromBlock} to ${toBlock}`,
      // );

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
            const detail = await contract.getDetail(event.args.token);
            const response = await axios.get(
              `https://api.binance.com/api/v3/ticker/price?symbol=SEIUSDT`,
            );
            const currentSupply = detail.info.currentSupply;
            const price = detail.info.priceForNextMint;
            // console.log("cursup" + currentSupply);
            // console.log("price" + price);
            // Format the date as DD/MM/YY
            const formattedDate = `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}/${String(date.getFullYear()).slice(-2)}`;

            // Log the event details along with the block timestamp
            // console.log(
            //   `Token Created: ${event.args.name} (${event.args.symbol}), Token Address: ${event.args.token}, Reserve Token: ${event.args.reserveToken} Block Timestamp: ${date}`,
            // );
            setCurCreateTic(event.args.symbol.substring(0, 5));
            setCurCreateUser(event.args.token.substring(0, 5)); // Fake value!
            setCurCreateTime(formattedDate);

            return {
              name: event.args.name,
              tic: event.args.symbol.substring(0, 5),
              user: event.args.token.substring(0, 5), // Fake value!
              time: formattedDate,
              addr: event.args.token,
              cap: ether(currentSupply) * (ether(price) * response.data.price),
            };
          }),
      );

      setCreateDatas((prevDatas) => [...newDatas, ...prevDatas]);

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

  const [tokenInfo, setTokenInfo] = useState<TokenInfo[] | null>(null);
  const [detailedTokens, setDetailedTokens] = useState<
    (TokenInfo & TokenDetail)[]
  >([]);
  type TokenInfo = {
    cid: string;
    description: string;
    telegramUrl?: string;
    tokenAddress: string;
    twitterUrl?: string;
    websiteUrl?: string;
    _id?: string;
  };

  type TokenDetail = {
    info: {
      name: string;
      symbol: string;
    };
    // Add other properties as needed
  };
  useEffect(() => {
    const fetchTokenInfo = async () => {
      try {
        const response = await fetch("http://localhost:3000/homeTokenInfo");
        const data: TokenInfo[] = await response.json();
        setTokenInfo(data);
        fetchDetails(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching token info:", error);
      }
    };

    fetchTokenInfo();
  }, []);

  const fetchFromDB = async (tokenAddress: string) => {
    const detail = await contract.getDetail(tokenAddress);
    return detail;
  };

  const fetchDetails = async (data: TokenInfo[]) => {
    try {
      const updatedTokens = await Promise.all(
        data.map(async (token) => {
          console.log("TA" + token.tokenAddress);
          const detail = await fetchFromDB(token.tokenAddress);
          console.log("det" + detail);
          return {
            ...token,
            ...detail,
          };
        }),
      );
      console.log("UPT" + updatedTokens);
      setDetailedTokens(updatedTokens);
    } catch (error) {
      console.error("Error fetching token details:", error);
    }
  };

  return (
    <>
      <main className="flex w-screen bg-[#0E0E0E]">
        <div className="mx-auto h-full w-[70vw] pt-[50px] ">
          <div className="mx-auto flex h-[465px] w-[55vw] max-w-[970px] items-center justify-evenly rounded-2xl border-2 border-[#FAFF00] bg-gradient-to-b from-red-600 to-red-800 py-[30px] shadow-[0_0px_20px_rgba(0,0,0,0.5)]  shadow-[#FAFF00]">
            <div className="flex h-full flex-col justify-between">
              <div className="flex h-full w-[500px] flex-col items-center gap-[30px] rounded-3xl border-2 border-white bg-black py-[30px] shadow-[0_0px_20px_rgba(0,0,0,0.5)] shadow-white">
                <Image
                  src="/images/To_the_moon.svg"
                  alt=""
                  width={300}
                  height={300}
                />

                <div className="w-[390px]">
                  <Link
                    href="/0x2Ed6C164217E3EC792655A866EF3493D2AAfBFb3"
                    className={`"border flex justify-between gap-[10px] border border-dashed border-[#F9FF00] bg-black p-[10px]   shadow-[0_0px_20px_rgba(0,0,0,0.5)] shadow-[#FF2525] `}
                  >
                    <div>
                      <div className="h-[100px] w-[100px] border-black bg-[#D9D9D9]"></div>
                    </div>
                    <div className=" text w-[334px] overflow-hidden px-[10px]">
                      <div className="">
                        <h1 className="text-[15px] font-bold leading-none text-[#ADADAD]">
                          ez
                        </h1>
                        <h1 className="text-[15px] font-bold leading-none text-[#ADADAD]">
                          [ticker: ez]
                        </h1>
                      </div>

                      <h1 className="neon-lime text-xs text-[#C5F900] ">
                        Created by:&nbsp;0x7A2
                      </h1>

                      <div className="flex">
                        <h1 className="neon-yellow text-xs text-[#FAFF00]">
                          Market cap:&nbsp;
                        </h1>
                        <h1
                          className={`neon-yellow ${digital.variable} font-digital text-xs text-[#FAFF00]`}
                        >
                          1.1K
                        </h1>
                      </div>

                      <h1 className=" text-[13px] font-normal leading-tight tracking-tight text-[#808080]">
                        desc
                      </h1>
                    </div>
                  </Link>
                </div>
                <div className="flex h-[140px] w-[390px] gap-[5px] rounded-lg border-4 border-[#A58C07] bg-black bg-gradient-to-b from-neutral-600 via-neutral-800 to-neutral-600 p-[10px]">
                  <div className="h-full w-[120px] rounded-xl bg-white"></div>
                  <div className="h-full w-[120px] rounded-xl bg-white"></div>
                  <div className="h-full w-[120px] rounded-xl bg-white"></div>
                </div>
              </div>
            </div>
            <Link href={"/create"}>
              <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="h-[300px] w-[200px]"
              >
                <Image
                  src={
                    isHovered
                      ? "/images/create_hovered.svg"
                      : "/images/create_default.svg"
                  }
                  alt="Create"
                  width={500}
                  height={1000}
                  className="h-full w-full"
                />
              </div>
            </Link>
          </div>

          <div className=" mt-10 flex w-full items-end justify-between px-10">
            <div className="h-full">
              <div className="mb-[20px] text-xl text-white underline">
                Tokens
              </div>
              <button className="mr-[20px] rounded-[10px] bg-[#363636] px-5 py-[15px] text-[#AEAEAE]">
                sort: created
              </button>
              <button className=" rounded-[10px] bg-[#363636] px-5 py-[15px] text-[#AEAEAE]">
                order: desc
              </button>
            </div>
            {/* <form className="">
              <input
                className="mr-[30px] h-[50px] w-[422px] rounded-[10px] border border-[#FF00C6] bg-black px-[20px] text-white"
                placeholder="search for token"
              ></input>
              <button className="h-[50px] w-[150px] rounded-[10px] bg-[#FF00C6]">
                search
              </button>
            </form> */}
          </div>

          {/* <!--           <div className="mb-[130px] mt-10 grid w-full min-w-[1100px] grid-cols-3 grid-rows-4 gap-[60px] p-8">
            {createDatas.slice(-12).map((card: any, index: any) => (
              <TokenCard
                key={index}
                name={card.name}
                ticker={card.tic}
                tokenAddress={card.addr}
                cap={card.cap}
                createdBy="Me"
                desc="desc"
              />
            ))} --> */}

          <div className="mt-10 grid h-[800px] w-full min-w-[1100px] grid-cols-3 grid-rows-4 gap-[60px] p-8">
            {tokenInfo ? (
              tokenInfo
                .slice(-12)
                .map((card: any, index: any) => (
                  <TokenCard
                    key={index}
                    name={card.name}
                    ticker={card.tic}
                    tokenAddress={card.tokenAddress}
                    cap={card.cap}
                    createdBy="Me"
                    desc={card.description}
                  />
                ))
            ) : (
              <p>No token information available.</p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
