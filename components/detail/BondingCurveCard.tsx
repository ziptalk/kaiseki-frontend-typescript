import { FC } from "react";
import { digital } from "@/fonts/font";

interface BondingCurveCardTypes {
  prog: number;
  desc: string;
}
const BondingCurveCard: FC<BondingCurveCardTypes> = ({ prog, desc }) => {
  return (
    <div className="bg-card flex w-[450px] flex-col rounded-[20px] rounded-tr-[100px] py-[13px] pl-[10px] pr-[66px]">
      <div className="flex h-[21px] items-end gap-2">
        <div className="text-[13px] leading-[15px] text-[#FAFF00]">
          Bonding Curve Progress:{" "}
        </div>
        <div
          className={`text-[27px] text-[#FAFF00] ${digital.variable} h-[24px] font-digital leading-none`}
        >
          {prog} %
        </div>
      </div>
      <div className="mt-[5px] h-[6px] w-full rounded-full bg-white">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${prog}%` }}
        />
      </div>
      <p className="mt-[21px] h-[85px] overflow-scroll text-[12px] leading-[18px] text-[#AEAEAE]">
        {desc}
      </p>
    </div>
  );
};

export default BondingCurveCard;
