import { FC } from "react";
import { TokenDesc } from "../common/TokenDesc";
import { digital } from "@/fonts/font";
import Pointing from "/public/icons/pointing.svg";
import Link from "next/link";

export const HomeTokenCard: FC<TokenCardTypes> = ({
  name,
  ticker,
  createdBy,
  rafflePrize,
  description,
  tokenAddress,
  clickedToken,
  cid,
  bondingCurve,
  marketCap,
}) => {
  return (
    <div
      // href={tokenAddress ? tokenAddress : ""}
      className={`relative h-full w-full cursor-pointer bg-[#252525] p-[10px] ${tokenAddress === clickedToken && "md:tokenarea-background"} md:hover:tokenarea-background border border-transparent`}
    >
      {bondingCurve === "100" && (
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[#000000b3] p-5">
          <img src="/images/not_for_sale.png" alt="Not for sale" />
          <Pointing className="absolute right-20 top-20 animate-bounce" />
          <Link
            className="dexbutton hover:dexbutton-hover absolute bottom-5 right-5 flex h-[50px] w-[150px] items-center justify-center rounded-2xl text-base font-bold text-white"
            href="https://app.uniswap.org/explore"
          >
            Go to the DEX
          </Link>
        </div>
      )}
      <div className={`flex ${createdBy && "h-[148px]"} gap-[10px]`}>
        <img
          src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}`}
          alt="Image from IPFS"
          className={`${createdBy ? "h-[120px] w-[120px]" : "h-[80px] w-[80px]"} border-black`}
        />
        <div className={`text h-full w-[270px] overflow-hidden px-[10px]`}>
          <TokenDesc
            {...{
              cid,
              createdBy,
              description,
              rafflePrize,
              name,
              ticker,
              tokenAddress,
            }}
          />
        </div>
      </div>
      <div className="flex items-center gap-[5px]">
        <h1 className="text-sm text-[#FAFF00]">Market cap :</h1>
        <h1
          className={`${digital.variable} font-digital text-lg leading-[14px] text-[#FAFF00]`}
        >
          {marketCap} ETH
        </h1>
        <div className="text-sm text-[#CFCFCF]">({Number(bondingCurve)}%)</div>
      </div>
      <div className="mt-[8px] h-[6px] w-full rounded-full bg-[#343434] text-[13px]">
        <div
          className="h-full rounded-full bg-gradient-to-t from-[#A60D07] to-[#E00900]"
          // style={{ width: `${Math.floor(bondingCurveProgress)}%` }}
          style={{ width: `${Math.floor(Number(bondingCurve))}%` }}
        ></div>
      </div>
    </div>
  );
};
