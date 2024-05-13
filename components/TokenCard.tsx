import { digital } from "@/fonts/font";
import { FC } from "react";

interface TokenCardTypes {
  name: string;
  ticker: string;
  createdBy: string;
  cap: string;
  desc: string;
}

const TokenCard: FC<TokenCardTypes> = ({
  name,
  ticker,
  createdBy,
  cap,
  desc,
}) => {
  return (
    <>
      <div className="flex h-[140px] max-h-[185px] w-[480px] justify-between gap-[10px] border border-dashed border-[#F9FF00] bg-black p-[10px] shadow-[0_0px_20px_rgba(0,0,0,0.5)] shadow-[#FF2525]">
        <div>
          <div className="h-[120px] w-[120px] border-black bg-[#D9D9D9]"></div>
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
            Created by:&nbsp;{createdBy}
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
      </div>
    </>
  );
};

export default TokenCard;
