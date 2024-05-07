"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import { abi } from "../abis/MCV2_Bond.sol/MCV2_Bond.json";
import contracts from "@/contracts/contracts";
import {
  type BaseError,
  useWriteContract,
  useAccount,
  useWaitForTransactionReceipt,
  useReadContract,
  useWatchContractEvent,
} from "wagmi";
import { useState } from "react";
import { type UseWaitForTransactionReceiptReturnType } from "wagmi";

export default function Home() {
  const [to, setTo] = useState<any>();
  const account: any = useAccount();

  return (
    <main className="h-screen w-screen">
      <header className="h-[10vh] w-screen bg-red-100 flex sticky top-0 left-0">
        <div className="flex justify-between w-full h-full items-center px-5">
          <div className="flex border border-r-black px-2 w-32">
            <div className="border ">logo</div>
            <div className="border ml-5">name</div>
          </div>
          <ConnectButton />
        </div>
      </header>
      <div className="w-[900px] h-full bg-blue-100 mx-auto">
        {/* <button onClick={() => mint()}>Transfer</button> */}
        <button
          onClick={() => {
            useWatchContractEvent({
              address: contracts.MCV2_Bond,
              abi,
              eventName: "TokenCreated",
              onLogs(logs) {
                console.log("New logs!", logs);
              },
            });
          }}
        >
          Read
        </button>
        {/* {error && (
          // <div>Error: {(error as BaseError).shortMessage || error.message}</div>
          <div>Error: {error.message}</div>
        )}
        <div>{account.address}</div>
        <div>{isPending}</div>
        {isPending ? <div>Pending True</div> : <div>Pending False</div>}
        <div>status: {status}</div>
        <div>res: {result}</div>
        {isSuccess ? (
          <>
            <div>Success : {data}</div>
            <div>token : {data}</div>
            <div>readData : {!readData}</div>
            <div>variables: {!variables}</div>
          </>
        ) : (
          <div>Not Success: {data}</div>
        )} */}
      </div>
    </main>
  );
}
