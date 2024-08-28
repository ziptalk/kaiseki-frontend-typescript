import { FC } from "react";

interface BondingCurveCardTypes {
  prog: number;
}
const BondingCurveCard: FC<BondingCurveCardTypes> = ({ prog }) => {
  return (
    <>
      <div className="flex w-full flex-col gap-[10px]  ">
        <h1 className="text-[18px] font-bold text-white">
          bonding curve progress:&nbsp;{prog}%
        </h1>
        <div className="h-[6px] w-full rounded-full bg-[#343434] text-[13px]">
          <div
            className="h-full rounded-full bg-gradient-to-t from-[#A60D07] to-[#E00900]"
            style={{ width: `${prog}%` }}
          ></div>
        </div>
        <h1 className="h-[75px] overflow-hidden leading-tight text-[#6A6A6A]">
          Once the bonding curve progress hits 100%, all the liquidity from the
          bonding curve will be deposited into dragonswap and burned.
          Progression increases as the price rises.
        </h1>
      </div>
    </>
  );
};

export default BondingCurveCard;
