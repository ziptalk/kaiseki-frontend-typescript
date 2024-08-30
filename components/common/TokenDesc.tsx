import React from "react";
interface TokenDescProps {
  name: string;
  ticker: string;
  creator: string;
  desc: string;
}

export const TokenDesc = ({ name, ticker, creator, desc }: TokenDescProps) => {
  return (
    <div className="w-full overflow-scroll">
      <h1 className="text-[15px] font-bold leading-none text-white">{name}</h1>
      <h1 className="text-[15px] font-bold leading-none text-white">
        [ticker: {ticker}]
      </h1>
      <div className="mt-[5px] flex items-center gap-[5px]">
        <h1 className="neon-lime text-[12px] text-[#C5F900]">created by: </h1>
        <img
          className="rounded-full"
          src="/images/memesinoGhost.png"
          alt=""
          style={{ width: 12, height: 12 }}
        />
        <h1 className="neon-lime mt-[3px] text-[12px] text-[#C5F900]">
          {creator.length < 20 ? creator : `${creator.slice(0, 20)}...`}
        </h1>
      </div>
      <div className="mt-[5px] overflow-scroll text-[13px] text-[#808080]">
        {desc}
      </div>
    </div>
  );
};
