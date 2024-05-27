"use client";

import reserveTokenABI from "@/abis/ReserveToken/ReserveToken.json";
import contracts from "@/contracts/contracts";
import { useEthersSigner } from "@/hooks/ethersSigner";
import { useAccount } from "wagmi";

const { ethers } = require("ethers");
const provider = new ethers.JsonRpcProvider(
  "https://evm-rpc-arctic-1.sei-apis.com",
);

const MintWSEI = () => {
  const signer = useEthersSigner();
  const reserveTokenContract = new ethers.Contract(
    contracts.ReserveToken,
    reserveTokenABI,
    signer,
  );
  const account = useAccount();

  const mint = async () => {
    try {
      const detail = await reserveTokenContract.mint(
        account.address,
        BigInt(1000000000000000000000000000000),
      );
      console.log(detail);
      alert("Claim Success!");
    } catch (error) {
      alert(error);
    }
  };
  return (
    <>
      <div className="flex w-full flex-col items-center">
        <h1>WSEI for free :)</h1>
        <button
          className="rounded-full bg-red-500 p-[25px] px-[40px]"
          onClick={() => mint()}
        >
          CLAIM!
        </button>
      </div>
    </>
  );
};

export default MintWSEI;
