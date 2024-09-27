import { FC, useEffect, useState } from "react";
import { TokenDesc } from "../common/TokenDesc";
import { digital } from "@/fonts/font";
import { getDataFromToken } from "@/utils/getCurve";

export const HomeTokenCard: FC<TokenCardTypes> = ({
  name,
  ticker,
  createdBy,
  threshold,
  rafflePrize,
  description,
  tokenAddress,
  clickedToken,
  cid,
  marketCap,
}) => {
  const [tokenData, setTokenData] = useState<any>(0);

  useEffect(() => {
    getDataFromToken(tokenAddress, threshold || 0.01).then((res: any) => {
      setTokenData(res);
    });
  }, [tokenAddress]);

  return (
    <div
      // href={tokenAddress ? tokenAddress : ""}
      className={`h-full w-full cursor-pointer bg-[#252525] p-[10px] ${tokenAddress === clickedToken && "md:tokenarea-background"} md:hover:tokenarea-background border border-transparent`}
    >
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
        <div className="text-sm text-[#CFCFCF]">
          ({tokenData.bondingCurve}%)
        </div>
      </div>
      <div className="mt-[8px] h-[6px] w-full rounded-full bg-[#343434] text-[13px]">
        <div
          className="h-full rounded-full bg-gradient-to-t from-[#A60D07] to-[#E00900]"
          // style={{ width: `${Math.floor(bondingCurveProgress)}%` }}
          style={{ width: `${Math.floor(tokenData.bondingCurve)}%` }}
        ></div>
      </div>
    </div>
  );
};
