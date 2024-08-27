import Link from "next/link";
import { FC } from "react";
import { TokenDesc } from "../atoms/TokenDesc";

export const HomeTokenCard: FC<TokenCardTypes> = ({
  name,
  ticker,
  createdBy,
  cap,
  desc,
  tokenAddress,
  cid,
}) => {
  return (
    <Link
      href={tokenAddress ? tokenAddress : ""}
      className={`hover:card-gradient flex h-[215px] w-[420px] justify-between gap-[10px] bg-[#252525] p-[10px]`}
      // style={{
      //   background:
      //     "linear-gradient(180deg, rgba(224, 9, 0, 0.60) 2.23%, rgba(166, 13, 7, 0.60) 97.87%)",
      // }}
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
    </Link>
  );
};
