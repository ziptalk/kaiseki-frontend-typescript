import React from "react";
import { ModalRootWrapper } from "@/components/common/Modal";
import Xbutton from "@/public/icons/XButton.svg";
import TradeArr from "@/public/icons/trade-arr.svg";
import { Tokens } from "../mypage/Tokens";
import { Raffle } from "../mypage/Raffle";
import { Trade } from "../mypage/Trade";
import { MyMeme } from "../mypage/MyMeme";

interface MypageModalProps {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MypageModal = ({ setModal }: MypageModalProps) => {
  const [tabIndex, setTabIndex] = React.useState(0);

  const Tabs = ["Token", "Raffle", "Trade", "My meme"];
  const TabContents = [
    <Tokens key="Tokens" />,
    <Raffle key="Raffle" />,
    <Trade key="Trade" />,
    <MyMeme key="MyMeme" />,
  ];

  return (
    <ModalRootWrapper onClick={() => setModal(false)}>
      <div
        className="absolute right-8 top-[80px] z-50 w-96 select-none rounded-[10px] border border-white bg-[#252525] p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <Xbutton
          onClick={() => setModal(false)}
          className="ml-auto cursor-pointer"
        />
        <h1 className="text-4xl font-bold leading-9 text-white">
          ${"13,121,342.12"}
        </h1>
        <div className="mt-2 flex items-center gap-2">
          <TradeArr
            className={`${false ? "fill-[#86BF77]" : "rotate-180 fill-red-500"}`}
          />
          <div className="text-lg text-[#7D7D7D]">$0.02(2.4%)</div>
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
        <div className="mt-7">{TabContents[tabIndex]}</div>
      </div>
    </ModalRootWrapper>
  );
};
