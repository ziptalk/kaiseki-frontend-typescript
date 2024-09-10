import { FC } from "react";
import { digital } from "@/fonts/font";

interface BondingCurveCardTypes {
  prog: number;
  home?: boolean;
  bgColor?: string;
}
const BondingCurveCard: FC<BondingCurveCardTypes> = ({
  prog,
  home = false,
  bgColor = "white",
}) => {
  return (
    <div className="flex w-full flex-col rounded-[20px]">
      <div className="flex h-[21px] items-end gap-2">
        <div className="text-sm leading-[15px] text-[#FAFF00]">
          Bonding Curve Progress:{" "}
        </div>
        <div
          className={`text-[27px] text-[#FAFF00] ${digital.variable} h-[24px] font-digital leading-none`}
        >
          {prog} %
        </div>
      </div>
      <div className={`mt-2 h-[6px] w-full rounded-full bg-${bgColor}`}>
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${prog}%` }}
        />
      </div>
      {home ? (
        <div className="mt-[21px] h-[90px] overflow-scroll text-[13px] leading-[18px] text-[#AEAEAE]">
          {
            "There are 800,000,000 still available for sale in the bonding curve and there are 0 TRX in the bonding curve. When the market cap reaches $ 78,960.73 all the liquidity from the bonding curve will be deposited into Sunswap and burned. Progression increases as the price goes up."
          }
        </div>
      ) : (
        <div className="mt-[21px] h-[90px] overflow-scroll text-[12px] leading-[18px] text-[#AEAEAE]">
          {
            "There are 800,000,000 still available for sale in the bonding curve and there are 0 TRX in the bonding curve. When the market cap reaches $ 78,960.73 all the liquidity from the bonding curve will be deposited into Sunswap and burned. Progression increases as the price goes up."
          }
        </div>
      )}
    </div>
  );
};

export default BondingCurveCard;
