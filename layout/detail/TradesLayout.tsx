import React from "react";
import { ethers } from "ethers";
import { RESERVE_SYMBOL } from "@/global/projectConfig";
import TradesCard from "@/components/detail/TradesCard";

interface TradesLayoutProps {
  memeTokenSymbol: string;
  TXLogs20FromServer: any | null;
}

export const TradesLayout = ({
  memeTokenSymbol,
  TXLogs20FromServer,
}: TradesLayoutProps) => {
  const transformToTradesCardType = (event: any): TradesCardType => {
    return {
      user: event.user,
      isBuy: event.isMint,
      reserveAmount: event.reserveAmount
        ? (
            Math.ceil(Number(ethers.formatEther(event.reserveAmount)) * 10000) /
            10000
          )
            .toFixed(4)
            .toString()
        : (
            Math.ceil(Number(ethers.formatEther(event.refundAmount)) * 10000) /
            10000
          )
            .toFixed(4)
            .toString(),

      memeTokenAmount: event.amountMinted
        ? Number(ethers.formatEther(event.amountMinted)).toFixed(0).toString()
        : ethers.formatEther(event.amountBurned),
      date: event.blockTimestamp.toString(),
      tx: event.transactionHash,
    };
  };

  const TradeListTitle = [
    "Account",
    "Buy / Sell",
    RESERVE_SYMBOL,
    memeTokenSymbol,
    "Date",
    "Transaction",
  ];

  return (
    <>
      <h1 className="mt-[30px] text-lg font-bold text-[#AEAEAE]">Trades</h1>
      <div className="mt-[10px] rounded-[10px] bg-card p-[20px]">
        <div className="flex w-full justify-between px-[20px] text-[#6A6A6A]">
          {TradeListTitle.map((title, idx) => (
            <div
              key={idx}
              className={`w-[14%] text-[13px] font-bold text-white ${title === "Transaction" && "text-right"}`}
            >
              {title}
            </div>
          ))}
        </div>
        <hr className="my-[10px] rounded-full border-[1.5px] border-[#313131]" />
        <div className="flex flex-col gap-[2px]">
          {TXLogs20FromServer ? (
            TXLogs20FromServer.map((event: any, idx: number) => {
              const cardProps = transformToTradesCardType(event);
              return <TradesCard key={idx} {...cardProps} />;
            })
          ) : (
            <p className="text-white">No results</p>
          )}
        </div>
      </div>
    </>
  );
};
