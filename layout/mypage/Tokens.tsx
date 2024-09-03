import React from "react";
import TradeArr from "@/public/icons/trade-arr.svg";
import Telegram from "@/public/icons/telegram_logo.svg";

const values = [
  {
    cid: "1",
    name: "Meme",
    value: "100.001",
    ticker: "F1T",
    price: "3.91",
    percentage: 2.4,
  },
  {
    cid: "1",
    name: "Meme",
    value: "100.001",
    ticker: "F1T",
    price: "3.91",
    percentage: 2.4,
  },
  {
    cid: "1",
    name: "Meme",
    value: "100.001",
    ticker: "F1T",
    price: "3.91",
    percentage: 2.4,
  },
];

export const Tokens = () => {
  return (
    <div className="flex flex-col gap-2.5">
      {values.map((value) => (
        <div key={value.cid} className="flex items-center justify-between py-3">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-[#5D5D5D]"></div>
            <div>
              <div className="text-base font-bold text-white">{value.name}</div>
              <div className="text-sm text-[#7D7D7D]">
                {value.value} {value.ticker}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-base font-bold text-white">${value.price}</div>
            <div className="flex items-center gap-1">
              <TradeArr
                className={`${false ? "fill-[#86BF77]" : "rotate-180 fill-red-500"}`}
              />
              <div className="text-base text-[#7D7D7D]">
                {value.percentage}%
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="ml-auto mt-10 rounded-full bg-[#D9D9D9] p-2">
        <Telegram className="cursor-pointer fill-[#5E5E5E]" />
      </div>
    </div>
  );
};
