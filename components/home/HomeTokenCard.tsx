import { FC } from "react";
import { TokenDesc } from "../common/TokenDesc";

export const HomeTokenCard: FC<TokenCardTypes> = ({
  name,
  ticker,
  createdBy,
  cap,
  desc,
  tokenAddress,
  hoveredToken,
  cid,
}) => {
  return (
    <div
      // href={tokenAddress ? tokenAddress : ""}
      className={`hover:card-gradient flex h-[215px] w-[420px] cursor-pointer justify-between gap-[10px] bg-[#252525] from-[#A60D0799] to-[#E0090099] p-[10px] ${tokenAddress === hoveredToken && "bg-gradient-to-t"} hover:bg-gradient-to-t`}
    >
      <img
        src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}`}
        alt="Image from IPFS"
        className="h-[120px] w-[120px] border-black "
      />
      <div className=" text w-[334px] overflow-hidden px-[10px]">
        <TokenDesc
          {...{
            name,
            ticker,
            creator: createdBy,
            marketCap: cap,
            desc,
          }}
        />
      </div>
    </div>
  );
};
