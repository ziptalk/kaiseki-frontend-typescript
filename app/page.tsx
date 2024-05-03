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
} from "wagmi";
import { useState } from "react";

export default function Home() {
  const {
    writeContract,
    error,
    isPending,
    data,
    isSuccess,
    writeContractAsync,
  } = useWriteContract();

  const [to, setTo] = useState<any>();
  const account: any = useAccount();
  const wei = (num: number, decimals = 18): bigint => {
    return BigInt(num) * BigInt(10) ** BigInt(decimals);
  };

  async function mint() {
    const token = await writeContractAsync({
      abi,
      address: contracts.MCV2_Bond,
      functionName: "createToken",
      args: [
        { name: "test6", symbol: "TST6" },
        {
          mintRoyalty: 0,
          burnRoyalty: 0,
          reserveToken: "0x36602b7f1706200ec47a680ba929995a11cd8ab7", // Should be set later
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
    alert(token);
    setTo(token);
  }

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
        <button onClick={() => mint()}>Transfer</button>
        <button
          onClick={() => {
            const result = useReadContract({
              abi,
              address: contracts.MCV2_Bond,
              functionName: "exists",
              args: [data],
            });

            alert(result);
          }}
        >
          Read
        </button>
        {error && (
          // <div>Error: {(error as BaseError).shortMessage || error.message}</div>
          <div>Error: {error.message}</div>
        )}
        <div>{account.address}</div>
        <div>{isPending}</div>
        {isPending ? <div>Pending True</div> : <div>Pending False</div>}
        {isSuccess ? (
          <>
            <div>Success : {data}</div>
            <div>token : {data}</div>
          </>
        ) : (
          <div>Not Success: {data}</div>
        )}
      </div>
    </main>
  );
}
