import { FC, useEffect, useState } from "react";
import { TokenDesc } from "../common/TokenDesc";
import BondingCurveCard from "../detail/BondingCurveCard";
import { setCurStepsIntoState } from "@/utils/getCurve";
export const MyPageTokenCard: FC<TokenCardTypes> = ({
  name,
  ticker,
  marketCap,
  description,
  tokenAddress,
  cid,
}) => {
  const [curve, setCurve] = useState(0);

  const getCurve = async () => {
    setCurve((await setCurStepsIntoState({ tokenAddress })) || 0);
  };
  useEffect(() => {
    getCurve();
  }, [tokenAddress]);
  return (
    <div className={`w-full bg-[#252525] md:hover:bg-[#2C2C2C]`}>
      <div className={`flex h-20 gap-[10px]`}>
        <img
          src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}`}
          alt="Image from IPFS"
          className={`h-[80px] w-[80px] border-black`}
        />
        <div className={`text h-full w-full overflow-hidden px-[10px]`}>
          <TokenDesc
            {...{
              cid,
              description,
              marketCap,
              name,
              ticker,
              tokenAddress,
            }}
          />
        </div>
      </div>
      <div className="mt-4 w-full">
        <BondingCurveCard prog={Math.floor(curve)} bgColor="[#454545]" my />
      </div>
    </div>
  );
};
