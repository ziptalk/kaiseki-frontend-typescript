import { FC } from "react";

interface HolderDistributionTypes {}

const HolderDistribution: FC = () => {
  return (
    <>
      <div className="mt-[70px] h-[560px] w-[420px] rounded-[10px] bg-[#1A1A1A] p-[30px]">
        <h1 className="font-bold text-[#ADADAD]">Holder distribution</h1>
        <div className="mt-[20px] gap-[8px] text-[#6A6A6A]">
          <div className=" flex justify-between font-bold">
            <h1>1. C87gCy 💳 (bonding curve)</h1>
            <h1>98.48%</h1>
          </div>
          <div className=" flex justify-between">
            <h1>2. H41bQv 🛠️ (dev)</h1>
            <h1>01.52%</h1>
          </div>
          <div className=" flex justify-between">
            <h1>3. H41bQv</h1>
            <h1>01.52%</h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default HolderDistribution;
