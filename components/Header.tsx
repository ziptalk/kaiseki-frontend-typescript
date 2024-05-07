"use client";

import {
  ConnectButton,
  useAccountModal,
  useConnectModal,
} from "@rainbow-me/rainbowkit";
import { FC } from "react";
import { useAccount } from "wagmi";

const Header: FC = () => {
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { isConnected } = useAccount();
  return (
    <>
      <header className="h-[90px] w-screen bg-[#1F1F1F] z-10 flex sticky top-0 left-0">
        <div className="flex justify-between w-full h-full px-[40px] items-center">
          <div className="flex px-2 h-[40px] items-center  border text-white">
            <div className="flex border-r items-center w-[330px] justify-evenly border-r-yellow-500  h-full">
              <div className="border rounded-full w-[40px] h-[40px] ">logo</div>
              <div className="">namesino</div>
              <h1 className="">TE</h1>
              <h1 className="">TW</h1>
              <h1 className="">IF</h1>
            </div>
            <div className="flex items-center h-full">
              <h1 className="px-[30px]">Dashbord</h1>
              <div className="w-[25vw] bg-gray-400 h-full"></div>
            </div>
          </div>
          <div className="flex items-center">
            {/* <ConnectButton /> */}
            {isConnected ? (
              <button
                onClick={openAccountModal}
                className="w-[180px] h-[45px] border rounded-[13.5px] text-white cursor-pointer"
              >
                Connect Wallet
              </button>
            ) : (
              <button
                onClick={openConnectModal}
                className="w-[180px] h-[45px] border rounded-[13.5px] text-white cursor-pointer"
              >
                Connected
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
