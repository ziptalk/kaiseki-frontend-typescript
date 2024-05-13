"use client";

import {
  ConnectButton,
  useAccountModal,
  useConnectModal,
} from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";
import { useAccount, useWatchContractEvent } from "wagmi";
import { abi } from "@/abis/MCV2_Bond.sol/MCV2_Bond.json";
import contracts from "@/contracts/contracts";

const Header: FC = () => {
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { isConnected } = useAccount();
  const pathname = usePathname();

  useWatchContractEvent({
    address: contracts.MCV2_Bond,
    abi,
    eventName: "TokenCreated",
    onLogs(logs) {
      console.log("New logs!", logs);
    },
    onError(error) {
      console.log("Error", error);
    },
  });

  return (
    <>
      <header className="sticky left-0 top-0 z-10 flex h-[90px] w-screen bg-[#1F1F1F]">
        {pathname == "/" && (
          <div className="absolute left-0 top-[90px] h-[80vh] w-[25vw] bg-purple-100"></div>
        )}

        <div className="flex h-full w-full items-center justify-between px-[40px]">
          <div className="flex h-[40px] items-center px-2 text-white">
            <div className="flex h-full w-[330px] items-center justify-evenly border-r  border-r-[#EAFF00]">
              <Link
                href="/"
                className="h-[40px] w-[40px] rounded-full  bg-gray-400 "
              ></Link>
              <div className="">namesino</div>
              <h1 className="">TE</h1>
              <h1 className="">TW</h1>
              <h1 className="">IF</h1>
            </div>
            <div className="flex h-full items-center">
              <h1 className="px-[30px]">Dashboard</h1>
              <div className="h-full w-[25vw] bg-gray-400"></div>
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
        {pathname == "/" && (
          <div className="absolute right-0 top-[90px] h-[80vh] w-[25vw] bg-purple-100 "></div>
        )}
      </header>
    </>
  );
};

export default Header;
