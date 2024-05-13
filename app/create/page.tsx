"use client";

import Header from "@/components/Header";
import { NextPage } from "next";

import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWatchContractEvent,
  useWriteContract,
} from "wagmi";
import { abi } from "@/abis/MCV2_Bond.sol/MCV2_Bond.json";
import contracts from "@/contracts/contracts";
import { ethers } from "ethers";
import { useEffect } from "react";
import { Contract } from "ethers";
import { useEthersSigner } from "@/hooks/ethers";
import { type UseAccountReturnType } from "wagmi";
import { useEthersProvider } from "@/config";
import { digital } from "@/fonts/font";

const Create: NextPage = () => {
  const provider = useEthersProvider();

  const contract = new Contract(contracts.MCV2_Bond, abi, provider);

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

  useEffect(() => {
    fetchPrevEvents();
  }, []);
  async function fetchPrevEvents() {
    console.log("entered");
    try {
      console.log("entered TRY");
      const events = await contract.queryFilter(
        contract.filters.TokenCreated(),
      );
      events.forEach((event) => {
        console.log(event);
      });
    } catch (error: any) {
      console.error("Error fetching events:", error.message);
    }
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name") as string;
    const ticker = formData.get("ticker") as string;

    await writeContractAsync({
      address: contracts.MCV2_Bond,
      abi,
      functionName: "createToken",
      args: [
        { name: name, symbol: ticker },
        {
          mintRoyalty: 0,
          burnRoyalty: 0,
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

  return (
    <>
      <Header />
      <div className="h-screen w-screen bg-gradient-to-br from-[#1F1F1F] to-[#220A09] ">
        <div className="mx-auto h-full w-[500px] ">
          <div className="mx-auto h-full  w-[480px] pt-[40px]">
            <div className="">
              <h1 className="text-center text-lg text-[#F9FF00]">Preview</h1>
              <div className="flex h-[185px] w-full justify-between gap-[10px] border border-dashed border-[#F9FF00] p-[10px] shadow-[0_0px_20px_rgba(0,0,0,0.5)] shadow-[#FF2525]">
                <div>
                  <div className="h-[120px] w-[120px] border-black bg-[#D9D9D9]"></div>
                </div>
                <div className=" text w-[334px] overflow-hidden px-[10px]">
                  <div className="">
                    <h1 className="text-[15px] font-bold leading-none text-[#ADADAD]">
                      Name
                    </h1>
                    <h1 className="text-[15px] font-bold leading-none text-[#ADADAD]">
                      [ticker: ticker]
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
                    Pizza ipsum dolor meat lovers buffalo. Bacon Aussie
                    mozzarella buffalo hand lovers string. Chicago garlic roll
                    banana mayo tomatoes banana pineapple marinara sauce. Thin
                    anchovies deep banana lasagna style ranch pesto string.
                    Onions crust fresh mayo dolor fresh onions pizza buffalo.
                  </h1>
                </div>
              </div>
            </div>
            <form onSubmit={submit}>
              <h1 className="mt-[30px] text-lg font-bold text-white">name</h1>
              <input
                name="name"
                type="text"
                placeholder="name"
                className="h-[60px] w-full rounded-[5px] border border-white bg-[#2E2929] p-[10px] text-white"
              />
              <h1 className="mt-[30px] text-lg font-bold text-white">ticker</h1>
              <input
                name="ticker"
                type="text"
                placeholder="ticker"
                className="h-[60px] w-full rounded-[5px] border border-white bg-[#2E2929] p-[10px] text-white"
              />
              <h1 className="mt-[30px] text-lg font-bold text-white">image</h1>
              <input
                name="image"
                type="file"
                accept="image/*"
                className=" flex h-[60px] w-full rounded-[5px] border border-white bg-[#2E2929] p-[15px] text-white"
              />
              <h1 className="mt-[30px] text-lg font-bold text-white">
                description
              </h1>
              <textarea
                name="description"
                placeholder="description"
                className="h-[120px] w-full rounded-[5px] border border-white bg-[#2E2929] p-[10px] text-white"
              />
              <button className="text-[#FF2626]">more options +</button>
              <button
                type="submit"
                className="h-[60px] w-full rounded-[5px] bg-purple-100 bg-gradient-to-r from-red-600 to-red-800 text-white"
              >
                Create Token
              </button>
            </form>
            {/* <form onSubmit={submitInEthers}>
              <h1>name</h1>
              <input
                name="name"
                type="text"
                className="h-[60px] w-full rounded-2xl"
              />
              <h1>ticker</h1>
              <input
                name="symbol"
                type="text"
                className="h-[60px] w-full rounded-2xl"
              />
              <button
                type="submit"
                className="w-full h-[110px] rounded-2xl bg-red-100"
              >
                Create Coin
              </button>
            </form>
            {isConfirming && <div>Waiting for confirmation...</div>} */}

            <div>status: {status}</div>
            <div>data : {mintData}</div>

            <button onClick={() => fetchEvent()}>eve</button>
            <button onClick={() => fetchPrevEvents()}>Peve</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Create;
