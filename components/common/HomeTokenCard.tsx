import { FC } from "react";
import { TokenDesc } from "../common/TokenDesc";
import BondingCurveCard from "../detail/BondingCurveCard";

export const MyPageTokenCard: FC<TokenCardTypes> = ({
  name,
  ticker,
  marketCap,
  description,
  tokenAddress,
  cid,
}) => {
  return (
    <div className={`w-full bg-[#252525] p-[10px] md:h-[215px]`}>
      <div className={`flex h-20 gap-[10px]`}>
        <img
          src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}`}
          alt="Image from IPFS"
          className={`h-[80px] w-[80px] border-black`}
        />
        <div className={`text h-full w-[270px] overflow-scroll px-[10px] `}>
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
      <div className="w-full">
        <BondingCurveCard prog={Math.floor(10)} bgColor="[#454545]" />
      </div>
    </div>
  );
};
