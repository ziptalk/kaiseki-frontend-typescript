"use client";

import Header from "@/components/Header";
import { NextPage } from "next";
import contracts from "@/contracts/contracts";
import {
  useWaitForTransactionReceipt,
  useWatchContractEvent,
  useWriteContract,
} from "wagmi";
import { abi } from "@/abis/MCV2_Bond.sol/MCV2_Bond.json";

import { ethers } from "ethers";
import { useEffect } from "react";
import { Contract } from "ethers";
import { useEthersSigner } from "@/hooks/ethers";

const Create: NextPage = () => {
  let signer = null;

  let provider;
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

        // It also provides an opportunity to request access to write
        // operations, which will be performed by the private key
        // that MetaMask manages for the user.
        signer = await provider.getSigner();
      }
    }
    init();
  }, []);

  signer = useEthersSigner();

  const contract = new Contract(contracts.MCV2_Bond, abi, signer);

  const {
    writeContract,
    error,
    isPending,
    data: hash,
    isSuccess,
    writeContractAsync,
    status,
    variables,
  } = useWriteContract();

  const wei = (num: number, decimals = 18): bigint => {
    return BigInt(num) * BigInt(10) ** BigInt(decimals);
  };

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name") as string;
    const symbol = formData.get("symbol") as string;

    writeContract({
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
  }

  async function submitInEthers(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name") as string;
    const symbol = formData.get("symbol") as string;
    const tx = await contract.createToken(
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
      }
    );
    const CA = await contract.createToken.staticCall(
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
      }
    );

    console.log(CA);
    await tx.wait();
    console.log(tx);
  }

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    data: transactionData,
  } = useWaitForTransactionReceipt({
    hash,
  });

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
      <div className="w-screen h-screen">
        <div className="w-[900px] h-full mx-auto bg-purple-100">
          <div className="w-[600px] h-full bg-blue-100 mx-auto">
            <div>
              <h1 className="text-center">Preview</h1>
              <div className="w-full h-[270px] bg-green-100 rounded-[33px] flex justify-between px-[30px] py-[35px]">
                <div>
                  <div className="w-[180px] h-[180px] border-black bg-white"></div>
                  <h1 className="text-center">120 x 120</h1>
                </div>
                <div className="bg-red-100 w-[260px]"></div>
              </div>
            </div>
            <form onSubmit={submit}>
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
            <form onSubmit={submitInEthers}>
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
            {isConfirming && <div>Waiting for confirmation...</div>}
            {isConfirmed && <div>Transaction confirmed.</div>}

            <div>contract : {transactionData?.contractAddress}</div>

            <div>status: {status}</div>
            <div>hash:{hash}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Create;
