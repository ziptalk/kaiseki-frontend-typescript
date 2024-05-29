import { digital } from "@/fonts/font";
import Link from "next/link";
import { FC } from "react";

interface TokenCardTypes {
  name: string;
  ticker: string;
  createdBy: string;
  cap: string;
  desc: string;
  border?: boolean;
  tokenAddress?: string;
  cid: string;
}

const TokenCard: FC<TokenCardTypes> = ({
  name,
  ticker,
  createdBy,
  cap,
  desc,
  border,
  tokenAddress,
  cid,
}) => {
  return (
    <>
      <Link
        href={tokenAddress ? tokenAddress : ""}
        className={`flex h-[140px] max-h-[195px] justify-between gap-[10px] ${border && "border border-dashed border-[#F9FF00] shadow-[0_0px_20px_rgba(0,0,0,0.5)] shadow-[#FF2525]"}  bg-[#0E0E0E] p-[10px] `}
      >
        <div>
          <div className="max-h-[120px] max-w-[120px] border-black bg-[#D9D9D9]">
            <img
              src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}`}
              alt="Image from IPFS"
            />
          </div>
        </div>
        <div className=" text w-[334px] overflow-hidden px-[10px]">
          <div className="">
            <h1 className="text-[15px] font-bold leading-none text-[#ADADAD]">
              {name}
            </h1>
            <h1 className="text-[15px] font-bold leading-none text-[#ADADAD]">
              [ticker: {ticker}]
            </h1>
          </div>

          <h1 className="neon-lime text-xs text-[#C5F900] ">
            Created by:&nbsp;{createdBy.slice(0, 6)}
          </h1>

          <div className="flex">
            <h1 className="neon-yellow text-xs text-[#FAFF00]">
              Market cap:&nbsp;
            </h1>
            <h1
              className={`neon-yellow ${digital.variable} font-digital text-xs text-[#FAFF00]`}
            >
              {cap}K
            </h1>
          </div>

          <h1 className="h-[90px] text-[13px] font-normal leading-tight tracking-tight text-[#808080]">
            {desc}
          </h1>
        </div>
      </Link>
    </>
  );
};

export default TokenCard;
