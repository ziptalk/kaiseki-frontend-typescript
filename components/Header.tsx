"use client";

import {
  ConnectButton,
  useAccountModal,
  useConnectModal,
} from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, useEffect } from "react";
import { useAccount, useWatchContractEvent } from "wagmi";
import { abi } from "@/abis/MCV2_Bond.sol/MCV2_Bond.json";
import contracts from "@/contracts/contracts";
import Image from "next/image";
import Logo from "/icons/MainLogo.svg";
import Web3 from "web3";

const Header: FC = () => {
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { isConnected } = useAccount();
  const pathname = usePathname();

  // useWatchContractEvent({
  //   address: contracts.MCV2_Bond,
  //   abi,
  //   eventName: "TokenCreated",
  //   onLogs(logs) {
  //     console.log("New logs!", logs);
  //   },
  //   onError(error) {
  //     console.log("Error", error);
  //   },
  // });
  // Initialize web3
  const web3 = new Web3("https://evm-rpc-arctic-1.sei-apis.com");

  // The contract ABI (Application Binary Interface), you can get this from the Solidity contract or Etherscan
  const contractABI = abi; //put your ABI here

  // The contract address
  const contractAddress = contracts.MCV2_Bond;

  // Create a new contract instance
  const contract = new web3.eth.Contract(contractABI, contractAddress);

  // useEffect(() => {
  //   const subscribeToEvents = async () => {
  //     const tx = await contract.events.TokenCreated({
  //       fromBlock: 0, // Adjust according to your needs, could be 'latest'
  //     });
  //     console.log("event" + tx);
  //   };

  //   subscribeToEvents();
  // }, []);

  return (
    <>
      <header className="sticky left-0 top-0 z-10 flex h-[80px] w-screen bg-[#1F1F1F]">
        {pathname == "/" && (
          <div className="absolute left-0 top-[90px] h-[80vh] w-[25vw] bg-purple-100"></div>
        )}

        <div className="flex h-full w-full items-center justify-between px-[40px]">
          <div className="flex h-[40px] w-full items-center justify-between px-2 text-white">
            <div className="flex h-full items-center justify-evenly gap-[30px]">
              <Link
                href="/"
                className="flex h-[40px] items-center gap-[15px] rounded-full "
              >
                <Image
                  src="/icons/MainLogo.svg"
                  alt=""
                  width={50}
                  height={50}
                  className="h-[32px] w-[32px]"
                />

                <Image
                  src="/images/Memesino.png"
                  alt=""
                  width={200}
                  height={100}
                  className="h-[22px] w-[76px]"
                />
              </Link>

              <div className="flex gap-[30px]">
                <Image
                  src="/icons/telegram_logo.svg"
                  alt=""
                  width={50}
                  height={50}
                  className="h-[15px] w-[15px]"
                />

                <Image
                  src="/icons/X_logo.svg"
                  alt=""
                  width={50}
                  height={50}
                  className="h-[15px] w-[15px]"
                />

                <Image
                  src="/icons/info.svg"
                  alt=""
                  width={50}
                  height={50}
                  className="h-[15px] w-[15px]"
                />
              </div>
            </div>
            <div className="flex h-full items-center gap-[20px]">
              <div className="flex h-full w-[400px] items-center justify-center gap-[5px] rounded-[10px] border border-[#F900FF] text-[#F900FF]">
                <div className="h-[18px] w-[18px] rounded-full bg-[#F900FF]" />
                <h1>username bought 0.1043 SEI of MEME</h1>
                <div className="h-[18px] w-[18px] rounded-full bg-[#F900FF]" />
              </div>
              <div className="flex h-full w-[400px] items-center justify-center gap-[5px] rounded-[10px] border border-[#09FFD2] text-[#09FFD2]">
                <div className="h-[18px] w-[18px] rounded-full bg-[#09FFD2]" />
                <h1>username bought 0.1043 SEI of MEME</h1>
                <div className="h-[18px] w-[18px] rounded-full bg-[#09FFD2]" />
              </div>
            </div>
            <div className="flex items-center">
              {/* <ConnectButton /> */}
              {isConnected ? (
                <button
                  onClick={openAccountModal}
                  className="h-[45px] w-[180px] cursor-pointer rounded-[13.5px] border text-white"
                >
                  Connected
                </button>
              ) : (
                <button
                  onClick={openConnectModal}
                  className="h-[45px] w-[180px] cursor-pointer rounded-[13.5px] border text-white"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
        {pathname == "/" && (
          <div className="absolute right-0 top-[90px] h-[80vh] w-[25vw] bg-purple-100 "></div>
        )}
      </header>
    </>
  );
};

export default Header;
