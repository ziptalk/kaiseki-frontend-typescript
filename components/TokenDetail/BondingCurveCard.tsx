import { digital } from "@/fonts/font";
import { FC } from "react";

interface BondingCurveCardTypes {
  prog: number;
  desc?: string;
}
const BondingCurveCard: FC<BondingCurveCardTypes> = ({ prog, desc }) => {
  return (
    <>
      <div className="flex h-full w-[40%] flex-col justify-between  ">
        <div className="flex items-center">
          <h1 className="text-lg font-bold text-[#ADADAD]">
            bonding curve progress:&nbsp;
          </h1>
          <h1
            className={`text-[#FAFF00] ${digital.variable} neon-yellow font-digital text-xl`}
          >
            {prog}%
          </h1>
        </div>
        <div className="h-[12px] w-full rounded-full bg-[#343434] text-[13px]">
          <div
            className="h-full rounded-full bg-[#FF2626] shadow-[0_0px_20px_rgba(0,0,0,0.5)] shadow-[#FF2626]"
            style={{ width: `${prog}%` }}
          ></div>
        </div>
        <h1 className="h-[75px] text-[#6A6A6A] ">
          Once the bonding curve progress hits 100%, all the liquidity from the
          bonding curve will be deposited into dragonswap and burned.
          Progression increases as the price rices.
        </h1>
      </div>
    </>
  );
};

export default BondingCurveCard;
