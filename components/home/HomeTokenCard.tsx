import { FC, useEffect, useState } from "react";
import { TokenDesc } from "../common/TokenDesc";
import { digital } from "@/fonts/font";
import { setCurStepsIntoState } from "@/utils/getCurve";

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
  const [bondingCurveProgress, setBondingCurveProgress] = useState(0);

  const fetchBondingCurveProgress = async () => {
    setBondingCurveProgress(
      (await setCurStepsIntoState({ tokenAddress })) || 0,
    );
  };

  useEffect(() => {
    fetchBondingCurveProgress();
  }, [tokenAddress]);

  return (
    <div
      // href={tokenAddress ? tokenAddress : ""}
      className={`h-full w-full cursor-pointer bg-[#252525] from-[#A60D0799] to-[#E0090099] p-[10px] ${tokenAddress === clickedToken && "md:bg-gradient-to-t"} md:hover:bg-gradient-to-t`}
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
              marketCap,
              name,
              ticker,
              tokenAddress,
            }}
          />
        </div>
      </div>
      <div className="flex items-center gap-[5px]">
        <h1 className="neon-yellow text-xs text-[#FAFF00]">
          Bonding Curve Progress :
        </h1>
        <h1
          className={`neon-yellow ${digital.variable} font-digital text-xs text-[#FAFF00]`}
        >
          {Number(marketCap).toLocaleString()}K
        </h1>
        <div className="text-[12px] text-[#CFCFCF]">
          ({bondingCurveProgress}%)
        </div>
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
