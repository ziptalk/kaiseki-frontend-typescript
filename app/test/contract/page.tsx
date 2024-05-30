"use client";

import { useEthersSigner } from "@/hooks/ethersSigner";
import React, { useEffect, useState } from "react";
import MCV2_TestArtifact1 from "@/abis/MCV2_Bond.sol/MCV2_Bond.json";
import MCV2_TestArtifact2 from "@/abis/MCV2_Bond.sol/MCV2_Bond.json";
import contracts from "@/contracts/contracts";

function App() {
  const { ethers } = require("ethers");
  const wei = (num: number, decimals = 18): bigint => {
    return BigInt(num) * BigInt(10) ** BigInt(decimals);
  };
  const ether = (weiValue: bigint, decimals = 18): number => {
    const factor = BigInt(10) ** BigInt(decimals);
    const etherValue = Number(weiValue) / Number(factor);
    return etherValue;
  };
  const signer = useEthersSigner();
  const { abi: MCV2_TestABI } = MCV2_TestArtifact1;
  const provider = new ethers.JsonRpcProvider(
    "https://evm-rpc-arctic-1.sei-apis.com",
  );
  const TestWriteContract = new ethers.Contract(
    contracts.MCV2_Test1,
    MCV2_TestABI,
    signer,
  );

  const TestContract = new ethers.Contract(
    contracts.MCV2_Bond,
    MCV2_TestABI,
    provider,
  );

  const fetchEvent = async () => {
    try {
      const filter = TestContract.filters.TokenCreated();
      const events = await TestContract.queryFilter(filter, -1000);

      if (events.length > 0) {
        for (const log of events) {
          const event = TestContract.interface.decodeEventLog(
            "TokenCreated",
            log.data,
            log.topics,
          );
          if (event[1] === name) {
            console.log("REAL TOKEN ADDR: " + event[0]);
            return event[0];
          }
        }
      } else {
        console.log("No events found");
      }
    } catch (error) {
      console.error("Error querying filter:", error);
    }
    return null;
  };

  const [isLoading, setIsLoading] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      const name = formData.get("name") as string;
      const ticker = formData.get("ticker") as string;

      setIsLoading(true);
      const receipt = await TestWriteContract.createToken(
        { name: name, symbol: ticker },
        {
          mintRoyalty: 10,
          burnRoyalty: 10,
          reserveToken: contracts.ReserveToken,
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
      );
      console.log(receipt);

      const createdTokenAddress = await fetchEvent();
      setcreatedTokenAddress(createdTokenAddress);
      console.log(createdTokenAddress);
      setIsLoading(false);

      //   afterMint(createdTokenAddress);
    } catch (error) {
      console.error("Error while minting:", error);
      setIsLoading(false);
    }
  }

  const [createdTokenAddress, setcreatedTokenAddress] = useState("");

  //   const afterMint = async (createdTokenAddress: string) => {
  //     // await getNextMintPrice(createdTokenAddress);
  //     // setIsModalVisible(true);
  //     router.push(`/${createdTokenAddress}`);
  //   };
  return <></>;
}

export default App;
