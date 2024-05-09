"use client";

import Header from "@/components/Header";
import { NextPage } from "next";
import contracts from "@/contracts/contracts";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWatchContractEvent,
  useWriteContract,
} from "wagmi";
import { abi } from "@/abis/MCV2_Bond.sol/MCV2_Bond.json";

import { ethers } from "ethers";
import { useEffect } from "react";
import { Contract } from "ethers";
import { useEthersSigner } from "@/hooks/ethers";
import { type UseAccountReturnType } from "wagmi";

const Create: NextPage = () => {
  let signer = null;
  let events;
  let provider;
  let filter;
  useEffect(() => {
    async function init() {
      if (window.ethereum == null) {
        // If MetaMask is not installed, we use the default provider,
        // which is backed by a variety of third-party services (such
        // as INFURA). They do not have private keys installed,
        // so they only have read-only access
        console.log("MetaMask not installed; using read-only defaults");
        provider = ethers.getDefaultProvider();
      } else {
        // Connect to the MetaMask EIP-1193 object. This is a standard
        // protocol that allows Ethers access to make all read-only
        // requests through MetaMask.
        provider = new ethers.BrowserProvider(window.ethereum);
        console.log(provider);
        // It also provides an opportunity to request access to write
        // operations, which will be performed by the private key
        // that MetaMask manages for the user.
        signer = await provider.getSigner();
      }
    }
    init();
  }, []);

  signer = useEthersSigner();

  const contract = new Contract(contracts.MCV2_Bond, abi, provider);

  async function eve() {
    try {
      const filter = contract.filters.TokenCreated();
      const events = await contract.queryFilter(filter, -100);
      console.log(events[0]);
    } catch (error) {
      console.error("Error querying filter:", error);
    }
  }

  const account: UseAccountReturnType = useAccount();
  // console.log(account);

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
    variables,
  } = useWriteContract();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name") as string;
    const symbol = formData.get("symbol") as string;

    const {
      data,
      error: rErr,
      isFetched,
    } = useReadContract({
      abi,
      address: contracts.MCV2_Bond,
      functionName: "tokensLength",
    });

    useEffect(() => {
      if (isFetched == false) return;
      writeContractAsync({
        address: contracts.MCV2_Bond,
        abi,
        functionName: "createToken",
        args: [
          { name: name, symbol: symbol },
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
    }, [isFetched]);
  }

  // async function submitInEthers(e: React.FormEvent<HTMLFormElement>) {
  //   e.preventDefault();
  //   const formData = new FormData(e.target as HTMLFormElement);
  //   const name = formData.get("name") as string;
  //   const symbol = formData.get("symbol") as string;
  //   const tx = await contract.createToken(
  //     { name: name, symbol: symbol },
  //     {
  //       mintRoyalty: 0,
  //       burnRoyalty: 0,
  //       reserveToken: "0x36602b7f1706200ec47a680ba929995a11cd8ab7", // Should be set later
  //       maxSupply: wei(10000000), // supply: 10M
  //       stepRanges: [
  //         wei(10000),
  //         wei(100000),
  //         wei(200000),
  //         wei(500000),
  //         wei(1000000),
  //         wei(2000000),
  //         wei(5000000),
  //         wei(10000000),
  //       ],
  //       stepPrices: [
  //         wei(0, 9),
  //         wei(2, 9),
  //         wei(3, 9),
  //         wei(4, 9),
  //         wei(5, 9),
  //         wei(7, 9),
  //         wei(10, 9),
  //         wei(15, 9),
  //       ],
  //     }
  //   );
  //   const CA = await contract.createToken.staticCall(
  //     { name: name, symbol: symbol },
  //     {
  //       mintRoyalty: 0,
  //       burnRoyalty: 0,
  //       reserveToken: "0x36602b7f1706200ec47a680ba929995a11cd8ab7", // Should be set later
  //       maxSupply: wei(10000000), // supply: 10M
  //       stepRanges: [
  //         wei(10000),
  //         wei(100000),
  //         wei(200000),
  //         wei(500000),
  //         wei(1000000),
  //         wei(2000000),
  //         wei(5000000),
  //         wei(10000000),
  //       ],
  //       stepPrices: [
  //         wei(0, 9),
  //         wei(2, 9),
  //         wei(3, 9),
  //         wei(4, 9),
  //         wei(5, 9),
  //         wei(7, 9),
  //         wei(10, 9),
  //         wei(15, 9),
  //       ],
  //     }
  //   );

  //   console.log(CA);
  //   await tx.wait();
  //   console.log(tx);
  // }

  async function mint(name: string, symbol: string) {
    const token = await writeContractAsync({
      abi,
      address: contracts.MCV2_Bond,
      functionName: "createToken",
      args: [
        { name: name, symbol: symbol },
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
  }

  return (
    <>
      <Header />
      <div className="h-screen w-screen bg-gradient-to-br from-[#1F1F1F] to-[#220A09]">
        <div className="mx-auto h-full w-[500px] ">
          <div className="mx-auto h-full  w-[480px] pt-[40px]">
            <div className="">
              <h1 className="text-center text-lg text-[#F9FF00]">Preview</h1>
              <div className="flex h-[185px] w-full justify-between gap-[10px] border border-dashed border-[#F9FF00] p-[10px] shadow-[0_0px_10px_rgba(0,0,0,0.25)] shadow-[#FF2525]">
                <div>
                  <div className="h-[120px] w-[120px] border-black bg-[#D9D9D9]"></div>
                </div>
                <div className=" text w-[334px] overflow-hidden px-[10px]">
                  <h1 className="text-[15px] font-bold leading-none text-[#ADADAD]">
                    Name <br />
                    [ticker: ticker]
                  </h1>

                  <h1 className="text-xs text-[#C5F900]">Created by: Name</h1>
                  <h1 className="text-xs text-[#FAFF00]">Market cap: 0.00k</h1>
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

            <button onClick={() => eve()}>eve</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Create;
