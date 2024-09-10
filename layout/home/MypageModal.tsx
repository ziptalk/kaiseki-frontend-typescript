import React from "react";
import Xbutton from "@/public/icons/XButton.svg";
import Power from "@/public/icons/big_power.svg";
import TradeArr from "@/public/icons/trade-arr.svg";
import { Tokens } from "../mypage/Tokens";
import { Raffle } from "../mypage/Raffle";
import { Trade } from "../mypage/Trade";
import { MyMeme } from "../mypage/MyMeme";

interface MypageModalProps {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  openAccountModal?: () => void;
}

export const MypageModal = ({
  setModal,
  openAccountModal,
}: MypageModalProps) => {
  const [tabIndex, setTabIndex] = React.useState(0);

  const Tabs = ["Token", "Raffle", "Trade", "My meme"];
  const TabContents = [
    <Tokens key="Tokens" />,
    <Raffle key="Raffle" />,
    <Trade key="Trade" />,
    <MyMeme key="MyMeme" />,
  ];

  return (
    <div
      className="z-50 h-full select-none overflow-hidden rounded-t-lg border-secondary bg-[#252525] p-5 md:absolute md:right-8 md:top-[80px] md:h-[548px] md:w-96 md:rounded-[10px] md:border"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="ml-auto flex w-14 cursor-pointer justify-end gap-2.5">
        <Power onClick={openAccountModal} className="md:hidden" />
        <Xbutton onClick={() => setModal(false)} />
      </div>
      <h1 className="text-4xl font-bold leading-9 text-white">
        ${"13,121,342.12"}
      </h1>
      <div className="mt-2 flex items-center">
        <TradeArr
          className={`${true ? "fill-[#86BF77]" : "rotate-180 fill-red-500"} h-4 w-4`}
        />
        <div
          className={`${true ? "text-[#86BF77]" : "text-red-500"} text-base`}
        >
          $0.02(2.4%)
        </div>
      </div>
      <div className="mt-9 flex gap-5 text-lg font-bold text-[#7D7D7D]">
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
      <div className="my-7 h-full overflow-scroll">{TabContents[tabIndex]}</div>
    </div>
  );
};
