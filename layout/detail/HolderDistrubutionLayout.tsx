import { FC } from "react";
import contracts from "@/global/contracts";

interface HolderDistributionType {
  distribution: FilteredData | undefined;
  creator: string;
}

export const HolderDistributionLayout: FC<HolderDistributionType> = ({
  distribution,
  creator,
}) => {
  return (
    <div className="bg-card mt-[30px] w-full px-[23px] py-[30px]">
      <div className="flex justify-between text-[14px] font-bold text-white">
        <p>Holder distribution</p>
        <p>Percentage</p>
      </div>
      <div className="mt-[14px] flex flex-col gap-[14px]">
        {distribution ? (
          Object.entries(distribution).map(([outerKey, innerObj], index) => (
            <div key={outerKey}>
              {Object.entries(innerObj).map(([innerKey, value], innerIndex) => (
                <div
                  key={innerKey}
                  className={`flex justify-between ${innerIndex ? "text-[#919191]" : "font-bold text-[#B8B8B8]"}`}
                >
                  <div className="flex">
                    {`${innerIndex + 1}. ${innerKey.substring(0, 6)}`}
                    {innerKey === contracts.MCV2_Bond && (
                      <p>&nbsp;💳 (bonding curve)</p>
                    )}
                    {innerKey == creator && <p>&nbsp;🛠️ (dev)</p>}
                  </div>
                  <p>{`${parseFloat(value)}%`}</p>
                </div>
              ))}
            </div>
          ))
        ) : (
          <p className="flex justify-between text-[#919191]">Loading...</p>
        )}
      </div>
    </div>
  );
};
