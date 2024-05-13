"use client";

import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { useAccount, useReadContract, useWatchContractEvent } from "wagmi";
import { abi } from "@/abis/MCV2_Bond.sol/MCV2_Bond.json";
import contracts from "@/contracts/contracts";
import { type UseReadContractReturnType } from "wagmi";
import Link from "next/link";

export default function Home() {
  const {
    data: lengData,
    error: lengError,
    isFetched: lengFetched,
  }: UseReadContractReturnType = useReadContract({
    abi,
    address: contracts.MCV2_Bond,
    functionName: "tokenCount",
  });

  const account = useAccount();

  const [data, setdata]: any = useState();
  const [tokenData, setTokenData]: any = useState();
  const [t, setT] = useState(false);

  useEffect(() => {
    setdata(Number(lengData));
    console.log("leng :" + lengData);
    console.log("leng :" + lengError);
  }, [lengData]);

  useEffect(() => {
    refetch();
  }, [t]);

  const {
    data: tokensData,
    error: tokensError,
    isFetched: tokensFetched,
    refetch,
  }: UseReadContractReturnType = useReadContract({
    abi,

    address: contracts.MCV2_Bond,
    functionName: "tokens",
    args: [],
  });

  useEffect(() => {
    if (tokensData == undefined || null) {
      refetch();
      console.log("Refetched!");
    } else {
      setTokenData(tokensData);
      console.log("tokens :" + tokenData);
      console.log("tokens :" + tokensError);
      console.log("tokens :" + tokensFetched);
    }
  }, [tokensFetched]);

  let cards = [];
  useEffect(() => {
    if (tokenData == undefined) return;
    for (let i = 0; i < tokenData.length; i++) {
      cards[i] = tokenData[i];
    }
  }, [tokenData]);

  return (
    <>
      <Header />

      <main className="flex  w-screen bg-gradient-to-br from-[#1F1F1F] to-[#220A09]">
        <div className="mx-auto h-full w-[50vw] bg-blue-100 pt-10 ">
          <div className="flex h-[300px] w-full  justify-between bg-red-100 px-10">
            <div className="flex h-full flex-col justify-between">
              <div className="h-[200px] w-[500px] rounded-3xl border bg-green-100"></div>
              <div className="flex h-12 w-[500px] justify-between bg-green-100">
                <input className="h-full w-[70%] bg-gray-100"></input>
                <button className="h-full w-[20%] bg-gray-100"></button>
              </div>
            </div>
            <div className="h-[300px] w-[200px] bg-violet-100"></div>
          </div>

          <div className="mt-10 h-[100px] w-full bg-red-100 px-10">
            <div className="h-full w-[500px] bg-green-100"></div>
          </div>

          <div className="mt-10 grid h-[800px] w-full grid-cols-3 grid-rows-4 rounded-3xl bg-red-100 p-8">
            {tokenData &&
              tokenData.map((i: string, index: number) => (
                <Link
                  href={`/${i}`}
                  className="h-[150px] w-[250px] overflow-x-hidden rounded-3xl bg-green-100"
                >
                  <h1 className="text-sm">{i}</h1>
                </Link>
              ))}
          </div>
          <></>
        </div>
      </main>
    </>
  );
}
