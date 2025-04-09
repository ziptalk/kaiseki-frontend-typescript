import { FC } from "react";

interface BondingCurveCardTypes {
  prog: number;
}
const HomeBondingCurveCard: FC<BondingCurveCardTypes> = ({ prog }) => {
  return (
    <>
      <div className="flex w-full flex-col gap-[10px]  ">
        <h1 className="text-[18px] font-bold text-white">
          bonding curve progress:&nbsp;{prog}%
        </h1>
        <div className="h-[6px] w-full rounded-full bg-[#343434] text-[13px]">
          <div
            className="h-full rounded-full bg-linear-to-t from-[#ff583e] to-[#ff583e]"
            style={{ width: `${prog}%` }}
          ></div>
        </div>
        <h1 className="h-[72px] overflow-hidden text-xs leading-tight text-[#6A6A6A]">
          There are 800,000,000 still available for sale in the bonding curve
          and there are 0 TRX in the bonding curve. When the market cap
          reaches $ 78,960.73 all the liquidity from the bonding curve will be
          deposited into Sunswap and burned. Progression increases as the price
          goes up.
        </h1>
      </div>
    </>
  );
};

export default HomeBondingCurveCard;
