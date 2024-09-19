import { FC, useEffect, useState } from "react";
import { TokenDesc } from "../common/TokenDesc";
import { digital } from "@/fonts/font";
import { setCurStepsIntoState } from "@/utils/getCurve";

export const HomeTokenCard: FC<TokenCardTypes> = ({
  name,
  ticker,
  createdBy,
  rafflePrize,
  description,
  tokenAddress,
  clickedToken,
  cid,
}) => {
  const [bondingCurveProgress, setBondingCurveProgress] = useState(0);
  const [marketCap, setMarketCap] = useState(0);

  const fetchBondingCurveProgress = async () => {
    await setCurStepsIntoState({ tokenAddress }).then((res) => {
      setBondingCurveProgress(res?.curve || 0);
      setMarketCap(res?.marketCap || 0);
    });
  };

  useEffect(() => {
    fetchBondingCurveProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
              marketCap,
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
        <div className="text-sm text-[#CFCFCF]">({bondingCurveProgress}%)</div>
      </div>
      <div className="mt-[8px] h-[6px] w-full rounded-full bg-[#343434] text-[13px]">
        <div
          className="h-full rounded-full bg-gradient-to-t from-[#A60D07] to-[#E00900]"
          // style={{ width: `${Math.floor(bondingCurveProgress)}%` }}
          style={{ width: `${Math.floor(bondingCurveProgress)}%` }}
        ></div>
      </div>
    </div>
  );
};
