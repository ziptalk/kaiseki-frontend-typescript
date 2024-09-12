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
        <BondingCurveCard prog={Math.floor(10)} bgColor="[#454545]" my />
      </div>
    </div>
  );
};
