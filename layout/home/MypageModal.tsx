import React, { useEffect } from "react";
import Xbutton from "@/public/icons/XButton.svg";
import Power from "@/public/icons/big_power.svg";
import Bomb from "@/public/icons/bomb.svg";
import Copy from "@/public/icons/copy.svg";
import { Trade } from "../mypage/Trade";
import { MyMeme } from "../mypage/MyMeme";
import { UsersTotalAssets } from "@/utils/apis/apis";

interface MypageModalProps {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  openAccountModal?: () => void;
  userAddress: `0x${string}` | undefined;
}

export const MypageModal = ({
  setModal,
  openAccountModal,
  userAddress,
}: MypageModalProps) => {
  const [tabIndex, setTabIndex] = React.useState(0);
  const [totalAsset, setTotalAsset] = React.useState(0.0);

  useEffect(() => {
    getAsset();
  }, []);

  const Tabs = [
    // "Token",
    //  "Raffle",
    "Trade",
    "My token",
  ];

  const TabContents = [
    // <Tokens key="Tokens" />,
    // <Raffle key="Raffle" />,
    <Trade key="Trade" {...{ userAddress, setModal }} />,
    <MyMeme key="MyMeme" {...{ userAddress, setModal }} />,
  ];

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const getAsset = async () => {
    const response = await UsersTotalAssets(userAddress);
    setTotalAsset(response.totalValue);
  };

  return (
    <div
      className="z-50  h-full select-none overflow-hidden rounded-t-lg border-secondary bg-[#252525] py-5 md:fixed md:right-11 md:top-[80px] md:h-[548px] md:w-96 md:rounded-[10px] md:border"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="mr-5 flex w-full items-center justify-between">
        <div className="ml-5 flex cursor-pointer items-center gap-1  md:hidden">
          <Bomb />
          <div
            onMouseDown={() => copyToClipboard(userAddress || "")}
            className="flex items-center gap-1 stroke-secondary text-secondary active:stroke-red-500 active:text-red-500"
          >
            <div className="text-[15px]">
              {userAddress?.slice(0, 6) + "..." + userAddress?.slice(-4)}
            </div>
            <Copy />
          </div>
        </div>
        <div className="ml-auto mr-5 flex cursor-pointer gap-2.5">
          <Power onClick={openAccountModal} className="md:hidden" />
          <Xbutton onClick={() => setModal(false)} />
        </div>
      </div>
      <h1 className="ml-5 mt-5 text-4xl font-bold leading-9 text-white">
        ETH {totalAsset}
      </h1>
      {/* <div className="ml-5 mt-2 flex items-center">
        <TradeArr
          className={`${true ? "fill-[#86BF77]" : "rotate-180 fill-red-500"} h-4 w-4`}
        />
        <div
          className={`${true ? "text-[#86BF77]" : "text-red-500"} text-base`}
        >
          $0.02(2.4%)
        </div>
      </div> */}
      <div className="ml-5 mt-9 flex gap-5 text-lg font-bold text-[#7D7D7D]">
        {Tabs.map((tab, index) => (
          <div
            key={index}
            className={`${tabIndex === index && "text-white"} cursor-pointer`}
            onClick={() => setTabIndex(index)}
          >
            {tab}
          </div>
        ))}
      </div>
      <div className="my-2.5 h-[80vh] overflow-scroll pb-20 md:h-96 md:pb-10">
        {TabContents[tabIndex]}
      </div>
    </div>
  );
};
