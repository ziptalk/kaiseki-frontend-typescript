import { FC } from "react";
import { TokenDesc } from "../common/TokenDesc";
import { digital } from "@/fonts/font";

export const HomeTokenCard: FC<TokenCardTypes> = ({
  name,
  ticker,
  createdBy,
  marketCap,
  description,
  tokenAddress,
  clickedToken,
  cid,
}) => {
  return (
    <div
      // href={tokenAddress ? tokenAddress : ""}
      className={`hover:card-gradient h-[215px] w-[420px] cursor-pointer bg-[#252525] from-[#A60D0799] to-[#E0090099] p-[10px] ${tokenAddress === clickedToken && "bg-gradient-to-t"} hover:bg-gradient-to-t`}
    >
      <div className="flex h-[148px] gap-[10px]">
        <img
          src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}`}
          alt="Image from IPFS"
          className="h-[120px] w-[120px] border-black "
        />
        <div className=" text h-[148px] w-[270px] overflow-hidden px-[10px]">
          <TokenDesc
            {...{
              name,
              ticker,
              creator: createdBy,
              marketCap,
              description,
            }}
          />
        </div>
      </div>
      <div className="flex items-center gap-[5px]">
        <h1 className="neon-yellow text-xs text-[#FAFF00]">market cap :</h1>
        <h1
          className={`neon-yellow ${digital.variable} font-digital text-xs text-[#FAFF00]`}
        >
          {marketCap}K
        </h1>
        <div className="text-[12px] text-[#CFCFCF]">(13%)</div>
      </div>
      <div className="mt-[8px] h-[6px] w-full rounded-full bg-[#343434] text-[13px]">
        <div
          className="h-full rounded-full bg-gradient-to-t from-[#A60D07] to-[#E00900]"
          // style={{ width: `${Math.floor(bondingCurveProgress)}%` }}
          style={{ width: `${Math.floor(13)}%` }}
        ></div>
      </div>
    </div>
  );
};
