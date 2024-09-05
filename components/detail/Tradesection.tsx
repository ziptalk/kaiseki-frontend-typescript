import React, { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAccount } from "wagmi";
import { Button } from "../atoms/Button";
import { useConnectModal } from "@rainbow-me/rainbowkit";

interface TradesectionProps {
  isBuy: boolean;
  setIsBuy: (value: boolean) => void;
  setIsInputInTokenAmount: (value: boolean) => void;
  isInputInTokenAmount: boolean;
  inputValue: string;
  handleInputChange: (e: any) => void;
  handlePercentage: (percent: number) => void;
  buy: (e: any) => void;
  sell: (e: any) => void;
  memeTokenSymbol: string;
  priceForNextMint: number;
  RESERVE_SYMBOL: string;
  raffle?: boolean;
}

export const Tradesection = ({
  isBuy,
  setIsBuy,
  setIsInputInTokenAmount,
  isInputInTokenAmount,
  inputValue,
  handleInputChange,
  handlePercentage,
  buy,
  sell,
  memeTokenSymbol,
  priceForNextMint,
  RESERVE_SYMBOL,
  raffle,
}: TradesectionProps) => {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const SellPercentageButton: FC = () => {
    const percentages = [25, 50, 75, 100];
    return (
      <div className="flex items-center gap-2">
        {percentages.map((percentage) => (
          <button
            key={percentage}
            type="button"
            className="flex items-center justify-center rounded-[4px] bg-[#454545] px-2 py-1 text-[12px] text-[#AEAEAE]"
            onClick={() => handlePercentage(percentage)}
          >
            {percentage}%
          </button>
        ))}
      </div>
    );
  };
  const BuySellButtonSection: FC = () => {
    return (
      <div className="flex h-[50px] justify-between gap-[5px]">
        <Button
          className={`h-full flex-1 ${!isBuy && "bg-[#454545]"}`}
          onClick={() => setIsBuy(true)}
        >
          Buy
        </Button>
        <Button
          className={`h-full flex-1 ${isBuy && "bg-[#454545]"}`}
          onClick={() => {
            setIsBuy(false);
            setIsInputInTokenAmount(true);
          }}
        >
          Sell
        </Button>
      </div>
    );
  };
  return (
    <form onSubmit={isBuy ? buy : sell} className="flex flex-col">
      <BuySellButtonSection />

      <div
        onClick={() => setIsInputInTokenAmount(!isInputInTokenAmount)}
        className={`mt-5 flex w-32 cursor-pointer items-center justify-center rounded-[4px] bg-[#454545] p-1 text-[12px] text-[#AEAEAE]`}
      >
        Switch to {memeTokenSymbol}
      </div>

      {isInputInTokenAmount ? (
        <>
          <div className="relative flex w-full items-center">
            <input
              className="my-[8px] h-[55px] w-full rounded-[10px] border border-[#5C5C5C] bg-[#454545] px-[20px] text-[#FFFFFF]"
              type="number"
              placeholder="Enter the amount"
              step="0.01"
              name="inputValue"
              value={inputValue}
              onChange={handleInputChange}
            />
            <div className="absolute right-0 mr-[20px] flex items-center gap-[5px]">
              {/* <div className="h-[24px] w-[24px] overflow-hidden  rounded-full">
              <img
                src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}`}
                alt="img"
              />
            </div>
            <h1 className="mt-1 text-[15px] font-bold text-white">
              {memeTokenSymbol}
            </h1> */}
              <button
                type="button"
                onClick={() => handlePercentage(100)}
                className="flex h-[30px] w-[52px] items-center justify-center rounded-[4px] border border-[#8F8F8F] bg-[#0E0E0E] px-[8px] text-sm text-white"
              >
                MAX
              </button>
            </div>
          </div>
          {/* <h1 className="text-[#B8B8B8]">
          {ether(
            BigInt(Math.floor(Number(inputValue))) *
              BigInt(priceForNextMint),
          )}
          &nbsp;{RESERVE_SYMBOL}
        </h1> */}
        </>
      ) : (
        <>
          {/*input amount == RESERVE_SYMBOL*/}
          <div className="relative flex w-full items-center">
            <input
              className="my-[8px] h-[55px] w-full rounded-[10px] border border-[#5C5C5C] bg-[#454545] px-[20px] text-[#FFFFFF]"
              type="number"
              placeholder="Enter the amount"
              step="0.01"
              name="inputValue"
              value={inputValue}
              onChange={handleInputChange}
            />
            <div className="absolute right-0 mr-[20px] flex items-center gap-[5px]">
              <div className="h-[24px] w-[24px] rounded-full">
                <Image src="/icons/SeiLogo.svg" alt="" height={24} width={24} />
              </div>

              <h1 className="mt-1 text-[15px] font-bold text-white">
                {RESERVE_SYMBOL}
              </h1>
            </div>
          </div>
          {/* <h1 className="text-[#B8B8B8]"> */}
          {/*RESERVE_SYMBOL value to memetoken*/}
          {/* {inputValue &&
              Number(
                String(
                  Math.floor(
                    Number(
                      ethers.parseEther(inputValue) / BigInt(priceForNextMint),
                    ),
                  ),
                ),
              )}
            &nbsp;{memeTokenSymbol}
          </h1> */}
        </>
      )}
      {isBuy || <SellPercentageButton />}
      {/*true == toggle module, false == percent for sell*/}
      {raffle && (
        <div className="text-[14px] text-white">
          {"Raffle has already progressed! -> "}
          <Link href={"#"} className="underline">
            Join the Raffle!
          </Link>
        </div>
      )}
      {isConnected ? (
        <Button submit className="mt-5 h-12" variant="gradiant">
          Place Trade
        </Button>
      ) : (
        <Button
          onClick={openConnectModal}
          className="mt-5 h-12"
          variant="gradiant"
        >
          Connect Wallet
        </Button>
      )}
    </form>
  );
};
