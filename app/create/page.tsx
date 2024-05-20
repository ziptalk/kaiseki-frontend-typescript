"use client";

import Header from "@/components/Header";
import { NextPage } from "next";

import {
  useAccount,
  useConnect,
  useReadContract,
  useWaitForTransactionReceipt,
  useWatchContractEvent,
  useWriteContract,
} from "wagmi";
import { abi } from "@/abis/MCV2_Bond.sol/MCV2_Bond.json";
import contracts from "@/contracts/contracts";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { Contract } from "ethers";
import { useEthersSigner } from "@/hooks/ethers";
import { type UseAccountReturnType } from "wagmi";
import { useEthersProvider } from "@/config";
import { digital } from "@/fonts/font";
import { injected } from "wagmi/connectors";
import Image from "next/image";

const Create: NextPage = () => {
  const provider = useEthersProvider();
  const account = useAccount();
  const contract = new Contract(contracts.MCV2_Bond, abi, provider);
  const { connect } = useConnect();
  const wei = (num: number, decimals = 18): bigint => {
    return BigInt(num) * BigInt(10) ** BigInt(decimals);
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

  // useEffect(() => {
  //   fetchEvent();
  // }, [isSuccess]);

  // 이벤트 이거 가져와짐 개꿀
  async function fetchEvent() {
    try {
      const filter = contract.filters.TokenCreated();
      const events: any = await contract.queryFilter(filter, -1000);
      console.log(events[0].args[0]); // token contract
    } catch (error) {
      console.error("Error querying filter:", error);
    }
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name") as string;
    const ticker = formData.get("ticker") as string;

    if (account.status === "disconnected") {
      alert("Connect your wallet first!");
      return;
    }
    if (name == "" || ticker == "") {
      alert("Invalid input value!");
      return;
    }

    await writeContractAsync({
      address: contracts.MCV2_Bond,
      abi,
      functionName: "createToken",
      args: [
        { name: name, symbol: ticker },
        {
          mintRoyalty: 12,
          burnRoyalty: 12,
          reserveToken: contracts.ReserveToken, // Should be set later
          maxSupply: wei(10000000), // supply: 10M
          stepRanges: [
            wei(10000),
            wei(100000),
            wei(200000),
            wei(500000),
            wei(1000000),
            wei(2000000),
            wei(5000000),
            wei(10000000),
          ],
          stepPrices: [
            wei(0, 9),
            wei(2, 9),
            wei(3, 9),
            wei(4, 9),
            wei(5, 9),
            wei(7, 9),
            wei(10, 9),
            wei(15, 9),
          ],
        },
      ],
    });

    await fetchEvent();
  }

  const [isToggle, setIsToggle] = useState(false);
  const [name, setName] = useState("");
  const [ticker, setTicker] = useState("");
  const [desc, setDesc] = useState("");

  const nameHandler = (event: any) => {
    setName(event.target.value);
  };

  const tickerHandler = (event: any) => {
    setTicker(event.target.value);
  };

  const descHandler = (event: any) => {
    setDesc(event.target.value);
  };
  return (
    <>
      <div className=" w-screen bg-[#0E0E0E] ">
        <div className="mx-auto h-full w-[500px] ">
          <div className="mx-auto h-full w-[484px] pt-[30px]">
            <div className="">
              <Image
                src="/images/Preview.svg"
                alt=""
                width={500}
                height={500}
                className="mx-auto h-full w-1/4"
              />
              <div className="flex h-[185px] w-full justify-between gap-[10px] border border-dashed border-[#F9FF00] p-[10px] shadow-[0_0px_20px_rgba(0,0,0,0.5)] shadow-[#FF2525]">
                <div>
                  <div className="h-[120px] w-[120px] border-black bg-[#D9D9D9]"></div>
                </div>
                <div className=" text w-[334px] overflow-hidden px-[10px]">
                  <div className="">
                    <h1 className="text-[15px] font-bold leading-none text-[#ADADAD]">
                      {name ? name : "Name"}
                    </h1>
                    <h1 className="text-[15px] font-bold leading-none text-[#ADADAD]">
                      [ticker: {ticker ? ticker : "ticker"}]
                    </h1>
                  </div>

                  <div className="flex">
                    <h1 className="neon-lime text-xs text-[#C5F900] ">
                      Created by:&nbsp;
                    </h1>
                    <h1 className="neon-lime text-xs text-[#C5F900] ">Name</h1>
                  </div>

                  <div className="flex">
                    <h1 className="neon-yellow text-xs text-[#FAFF00]">
                      Market cap:&nbsp;
                    </h1>
                    <h1
                      className={`neon-yellow ${digital.variable} font-digital text-xs text-[#FAFF00]`}
                    >
                      0.00K
                    </h1>
                  </div>

                  <h1 className="h-[90px] text-[13px] font-normal leading-tight tracking-tight text-[#808080]">
                    {desc
                      ? desc
                      : "Pizza ipsum dolor meat lovers buffalo. Bacon Aussie mozzarella buffalo hand lovers string. Chicago garlic roll banana mayo tomatoes banana pineapple marinara sauce. Thin anchovies deep banana lasagna style ranch pesto string. Onions crust fresh mayo dolor fresh onions pizza buffalo."}
                  </h1>
                </div>
              </div>
            </div>
            <form onSubmit={submit}>
              <h1 className="mt-[30px] pb-[7px] text-[16px] font-normal text-white">
                name
              </h1>
              <input
                name="name"
                type="text"
                placeholder="name"
                value={name}
                onChange={nameHandler}
                className="h-[50px] w-full rounded-[5px] border border-[#8F8F8F] bg-[#303030] p-[10px] text-white"
              />
              <h1 className="mt-[15px] pb-[7px] text-[16px] font-normal text-white">
                ticker
              </h1>
              <input
                name="ticker"
                type="text"
                placeholder="ticker"
                value={ticker}
                onChange={tickerHandler}
                className="h-[50px] w-full rounded-[5px] border border-[#8F8F8F] bg-[#303030] p-[10px] text-white"
              />
              <h1 className="mt-[15px] pb-[7px] text-[16px] font-normal text-white">
                image
              </h1>
              <input
                name="image"
                type="file"
                accept="image/*"
                className=" flex h-[50px] w-full items-center rounded-[5px] border border-[#8F8F8F] bg-[#303030] p-[15px] text-white"
              />
              <h1 className="mt-[15px] pb-[7px] text-[16px] font-normal text-white">
                description
              </h1>
              <textarea
                value={desc}
                onChange={descHandler}
                name="description"
                placeholder="description"
                className="h-[120px] w-full rounded-[5px] border border-[#8F8F8F] bg-[#303030] p-[10px] text-white"
              />
              <div
                onClick={() => setIsToggle(!isToggle)}
                className="mt-[18px] flex cursor-pointer text-[#FF2626]"
              >
                <h1>more options&nbsp;</h1>
                <h1 className="text-white">{isToggle ? "-" : "+"}</h1>
              </div>
              {isToggle && (
                <>
                  <h1 className="mt-[20px] pb-[7px] text-[16px] font-normal text-white">
                    twitter link
                  </h1>
                  <input
                    name="twitter link"
                    type="text"
                    placeholder="(optional)"
                    className="h-[50px] w-full rounded-[5px] border border-[#8F8F8F] bg-[#303030] p-[10px] text-white"
                  />
                  <h1 className="mt-[19px] pb-[7px]  text-[16px] font-normal text-white">
                    telegram link
                  </h1>
                  <input
                    name="telegram link"
                    type="text"
                    placeholder="(optional)"
                    className="h-[50px] w-full rounded-[5px] border border-[#8F8F8F] bg-[#303030] p-[10px] text-white"
                  />
                  <h1 className="mt-[19px] pb-[7px] text-[16px] font-normal text-white">
                    website link
                  </h1>
                  <input
                    name="website link"
                    type="text"
                    placeholder="(optional)"
                    className="h-[50px] w-full rounded-[5px] border border-[#8F8F8F] bg-[#303030] p-[10px] text-white"
                  />
                </>
              )}
              <button
                type="submit"
                className="mt-[34px] h-[60px] w-full rounded-[8px] bg-gradient-to-b from-[#FF0000] to-[#900000] font-['Impact'] text-[16px] font-light tracking-wider text-white shadow-[0_0px_20px_rgba(255,38,38,0.5)]"
              >
                Create Token
              </button>
            </form>

            <div>status: {status}</div>
            <div>data : {mintData}</div>

            <button onClick={() => fetchEvent()}>eve</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Create;
